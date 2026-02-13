import Surface411 from "./surface411";


const BRAND: any = "surface"; // can be from env

let BrandConfig: any;

switch (BRAND) {
    case "surface":
        BrandConfig = Surface411;
        break;
}

export const colors = BrandConfig?.colors;
export const images = BrandConfig.images;
export const label = BrandConfig.labels;
