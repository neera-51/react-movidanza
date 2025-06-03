// utils/textUtils.js

export function capitalizeAndClean(text) {
    if (!text || typeof text !== "string") return ""
    return text
        .replace(/\s+/g, " ") // elimina espacios dobles o múltiples
        .trim() // elimina espacios al principio/final
        .toLowerCase()
        .replace(/^./, (letter) => letter.toUpperCase()) // Capitaliza la primera palabra
}


export function capitalize(text) {
    if (!text || typeof text !== "string") return ""

    return text
        .replace(/\s+/g, " ")       // Reemplaza múltiples espacios por uno solo
        .trim()                     // Elimina espacios al inicio y final
        .toLowerCase()              // Pasa todo a minúsculas
        .split(" ")                 // Divide en palabras
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
        .join(" ")
}
