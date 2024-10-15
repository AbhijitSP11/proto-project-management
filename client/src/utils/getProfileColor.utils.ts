import { colors } from "@/constants/constants";

export function getColorForName(name: string) {
    const index = name.length % colors.length; 
    return colors[index];
}