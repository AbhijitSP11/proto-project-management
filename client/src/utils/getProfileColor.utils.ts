import { colors } from "@/constants/constants";

export function getColorForName(name: string) {
    const index = name.length % colors.length; 
    console.log("color index", colors[index])
    return colors[index];
}