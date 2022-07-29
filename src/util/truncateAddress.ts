import truncate from 'truncate-middle';

export const truncateAddress = (address: string) => truncate(address, 8, 6, '...');