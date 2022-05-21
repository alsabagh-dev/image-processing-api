export const getThumbnailName = (
    filename: string,
    width: number,
    height: number
): string => {
    return `${filename}_${width}_${height}.jpg`;
};
