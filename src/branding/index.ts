import Pipeline411 from "./pipeline411";
import Surface411 from "./surface411";
import Petro411 from "./petro411";
import Digg411 from "./digg411";
import Row411 from "./row411";


const BRAND: any = "surface"; // can be from env

let BrandConfig: any;

switch (BRAND) {
    case "petro":
        BrandConfig = Petro411;
        break;
    case "digg":
        BrandConfig = Digg411;
        break;
    case "pipeline":
        BrandConfig = Pipeline411;
        break;
    case "row":
        BrandConfig = Row411;
        break;
    case "surface":
        BrandConfig = Surface411;
        break;
    case "petro":
        BrandConfig = Petro411;
        break;
}

export const colors = BrandConfig?.colors;
export const images = BrandConfig.images;
export const label = BrandConfig.labels;
