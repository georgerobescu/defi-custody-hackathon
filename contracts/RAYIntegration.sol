// TODO: RAY is written in solidity 0.4, we are using 0.5 is it a problem?
pragma solidity >=0.5.0 <0.6.0;

// external dependencies
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";

// internal dependencies
import "./interfaces/ray/IRAY.sol";
import "./interfaces/ray/IRAYStorage.sol";

contract RAYIntegration is Initializable, ERC721Holder {


    /*************** VARIABLE DECLARATIONS **************/


    // RAY smart contracts used, these id's can be used to identify them dynamically
    bytes32 internal ADMIN_CONTRACT;
    bytes32 internal PORTFOLIO_MANAGER_CONTRACT;

    bytes32 internal PAYER_CONTRACT;
    bytes32 internal RAY_TOKEN_CONTRACT;
    bytes32 internal NAV_CALCULATOR_CONTRACT;

    bytes4 internal ERC721_RECEIVER_STANDARD;
    address internal NULL_ADDRESS;

    IRAYStorage public rayStorage;

    // map the 'true' owners of the RAY tokens owned by this contract
    mapping(bytes32 => address payable) public rayTokens;
    mapping(address => bytes32[]) public reverseRayTokens;


    event InvestmentRAY(bytes32 portfolioId, address beneficiary, uint256 value, bytes32 rayTokenId);
    event DepositRAY(bytes32 rayTokenId, uint256 value, address beneficiary);
    event RedeemRAY(bytes32 rayTokenId, uint256 value, address beneficiary);
    event FundsTransferRAY(address tokenAddress, address from, address beneficiary, uint256 value);


    /*************** MODIFIER DECLARATIONS **************/


    /// @dev  A modifier that verifies either the msg.sender == our Payer contract
    ///       and then the original caller is passed as a parameter (so check the original caller)
    ///       since we trust Payer. Else msg.sender must be the true owner of the token.
    ///
    ///       This functionality enables paying for users transactions when interacting
    ///       with RAY.
    ///
    ///       origCaller is the address that signed the transaction that went through Payer
    modifier onlyTokenOwner(bytes32 tokenId, address origCaller) {
        if (msg.sender == rayStorage.getContractAddress(PAYER_CONTRACT)) {
            require(rayTokens[tokenId] == origCaller, "#RAYIntegration onlyTokenOwner modifier: The original caller is not the owner of the token");
        } else {
            require(rayTokens[tokenId] == msg.sender, "#RAYIntegration onlyTokenOwner modifier: The caller is not the owner of the token");
        }
        _;
    }


    /////////////////////// FUNCTION DECLARATIONS BEGIN ///////////////////////

    /******************* PUBLIC FUNCTIONS *******************/


    /// @notice  Init contract by referencing the Eternal storage contract of RAY
    ///
    /// @param   _rayStorage - The address of the RAY storage contract

    function init(address _rayStorage) public initializer {
        rayStorage = IRAYStorage(_rayStorage);

        // constants
        ADMIN_CONTRACT = keccak256("AdminContract");
        PORTFOLIO_MANAGER_CONTRACT = keccak256("PortfolioManagerContract");
        PAYER_CONTRACT = keccak256("PayerContract");
        RAY_TOKEN_CONTRACT = keccak256("RAYTokenContract");
        NAV_CALCULATOR_CONTRACT = keccak256("NAVCalculatorContract");
        ERC721_RECEIVER_STANDARD = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
        NULL_ADDRESS = address(0);
    }

    function genPortfolioId(string memory portfolioDescription) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(portfolioDescription));
    }

    function getRayTokens(address wallet) public returns (bytes32[] memory) {
        return reverseRayTokens[wallet];
    }

    function getTokenOwner(bytes32 tokenId) external view returns (address) {
        return rayTokens[tokenId];
    }

    /// @notice  Fallback function to receive Ether
    ///
    /// @dev     Required to receive Ether from PortfolioManager upon withdraws
    function() external payable {}


    /** --------------------- RAY ENTRYPOINTS --------------------- **/


    /// @notice  Allows users to deposit ETH or accepted ERC20's to this contract and
    ///          used as capital. In return they receive an ERC-721 'RAY' token.
    ///
    /// @param   portfolioId - The portfolio id
    /// @param   beneficiary - The address that will own the position
    /// @param   value - The amount to be deposited denominated in the smallest units
    ///                  in-kind. Ex. For USDC, to deposit 1 USDC, value = 1000000
    ///
    /// @return   The unique token id of the new RAY token position
    function mint(bytes32 portfolioId, address payable beneficiary, uint value)
        external
        payable
        returns (bytes32)
    {
        address rayContract = rayStorage.getContractAddress(PORTFOLIO_MANAGER_CONTRACT);
        uint payableValue = verifyValue(portfolioId, beneficiary, value, rayContract);

        // this contract will own the minted RAY
        bytes32 rayTokenId = IRAY(rayContract).mint.value(payableValue)(portfolioId, address(this), value); // payable value can be 0

        // map RAY's to their true owners
        rayTokens[rayTokenId] = beneficiary;
        reverseRayTokens[beneficiary].push(rayTokenId);

        emit InvestmentRAY(portfolioId, beneficiary, value, rayTokenId);

        return rayTokenId;
    }


    /// @notice  Adds capital to an existing RAY token, this doesn't restrict who
    ///          adds. Addresses besides the owner can add value to the position.
    ///
    /// @dev     The value added must be in the same underlying asset as the position.
    ///
    /// @param   rayTokenId - The unique id of the RAY token
    /// @param   value - The amount to be deposited denominated in the smallest units
    ///                  in-kind. Ex. For USDC, to deposit 1 USDC, value = 1000000
    function deposit(bytes32 rayTokenId, uint value) external payable {
        bytes32 portfolioId = rayStorage.getTokenKey(rayTokenId);
        address rayContract = rayStorage.getContractAddress(PORTFOLIO_MANAGER_CONTRACT);

        uint payableValue = verifyValue(portfolioId, msg.sender, value, rayContract);

        IRAY(rayContract).deposit.value(payableValue)(rayTokenId, value);

        emit DepositRAY(rayTokenId, value, rayTokens[rayTokenId]);
    }


    /// @notice   Withdraw value from a RAY token
    ///
    /// @dev      Caller must be the 'true' owner of the token or RAY's GasFunder (Payer) contract
    ///
    /// @param    rayTokenId - The id of the position
    /// @param    valueToWithdraw - The value to withdraw
    /// @param    originalCaller - Unimportant unless Payer is the msg.sender, tells
    ///                            us who signed the original message.
    function redeem(bytes32 rayTokenId, uint valueToWithdraw, address originalCaller)
        internal
        returns (bytes32, uint256)
    {
        bytes32 portfolioId = rayStorage.getTokenKey(rayTokenId);
        address rayContract = rayStorage.getContractAddress(PORTFOLIO_MANAGER_CONTRACT);

        uint valueAfterFee = 
            IRAY(rayContract).redeem(rayTokenId, valueToWithdraw, originalCaller);

        emit RedeemRAY(rayTokenId, valueAfterFee, rayTokens[rayTokenId]);
        return (portfolioId, valueAfterFee);
    }

    /// @notice   Withdraw value from a RAY token
    ///
    /// @dev      Caller must be the 'true' owner of the token or RAY's GasFunder (Payer) contract
    ///
    /// @param    rayTokenId - The id of the position
    /// @param    valueToWithdraw - The value to withdraw
    /// @param    originalCaller - Unimportant unless Payer is the msg.sender, tells
    ///                            us who signed the original message.
    function redeemAndWithdraw(bytes32 rayTokenId, uint valueToWithdraw, address originalCaller)
        public
    {
        bytes32 portfolioId;
        uint256 valueAfterFee;
        
        (portfolioId, valueAfterFee) = redeem(rayTokenId, valueToWithdraw, originalCaller);

        address payable beneficiary = rayTokens[rayTokenId];
        transferFunds(portfolioId, beneficiary, valueAfterFee);
    }


    /// @notice  Gets a RAY tokens current value
    ///
    /// @param    rayTokenId - The unique token id of the RAY
    ///
    /// @return   Value of the token
    function getTokenValue(bytes32 rayTokenId) public view returns (uint) {

        uint tokenValue;
        uint pricePerShare;

        bytes32 portfolioId = rayStorage.getTokenKey(rayTokenId);

        (tokenValue, pricePerShare) = IRAY(rayStorage.getContractAddress(NAV_CALCULATOR_CONTRACT)).getTokenValue(portfolioId, rayTokenId);

        return tokenValue;
    }


    /************************ INTERNAL FUNCTIONS **********************/


    /// @notice  Verifies the funds have been credited to this contract and then
    ///          returns the 'payable' value - the amount of ETH to be forwarded.
    ///
    /// @param   portfolioId - The portfolioId the RAY being minted or deposited is
    ///                        associated with
    /// @param   funder - The address funding the transaction
    /// @param   inputValue - The value input to the function parameter
    /// @param   rayContract - The address of the PortfolioManager
    ///
    /// @return  The 'payable' value to be forwarded to the PortfolioManager
    function verifyValue(
        bytes32 portfolioId,
        address funder,
        uint inputValue,
        address rayContract
    ) internal returns(uint) {
        address principalAddress = rayStorage.getPrincipalAddress(portfolioId);

        if (rayStorage.getIsERC20(principalAddress)) {
            require(IERC20(principalAddress).transferFrom(funder, address(this), inputValue),
                "#RAYIntegration verifyValue(): Transfer of ERC20 Token failed");

            // could one time max approve the ray contract (or everytime it upgrades and changes addresses)
            require(IERC20(principalAddress).approve(rayContract, inputValue),
                "#RAYIntegration verifyValue(): Approval of ERC20 Token failed");

            return 0;
        } else {
            require(inputValue == msg.value, "#RAYIntegration verifyValue(): ETH value sent does not match input value");
            return inputValue;
        }
    }


    /// @notice  Used to transfer ETH or ERC20's
    ///
    /// @param   portfolioId - The portfolio id, used to get the coin associated
    /// @param   beneficiary - The address to send funds to - is untrusted
    /// @param   value - The value to send in-kind in smallest units
    function transferFunds(
        bytes32 portfolioId,
        address payable beneficiary,
        uint value
    ) internal {
        address principalAddress = rayStorage.getPrincipalAddress(portfolioId);

        if (rayStorage.getIsERC20(principalAddress)) {
            require(IERC20(principalAddress).transfer(beneficiary, value),
                "#RAYIntegration transferFunds(): Transfer of ERC20 token failed");
            emit FundsTransferRAY(principalAddress, address(this), beneficiary, value);
        } else {
            beneficiary.transfer(value);
            emit FundsTransferRAY(address(0), address(this), beneficiary, value);
        }
    }
}
