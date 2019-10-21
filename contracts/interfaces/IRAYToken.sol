pragma solidity >=0.5.0 <0.6.0;

interface IRAYToken {

    function mintRAYToken(bytes32 key, address beneficiary) external returns (bytes32);

    function ownerOf(uint256 tokenId) external view returns (address);

    function tokenExists(bytes32 tokenId) external view returns (bool exists);

    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;

}
