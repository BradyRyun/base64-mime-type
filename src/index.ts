enum MIMEType {
    JPEG = "image/jpeg",
    PNG = "image/png",
    XML = "application/xml",
    PDF = "application/pdf",
    JSON = "application/json",
    ZIP = "application/zip",
    HTML = "text/html",
    TEXT = "text/plain"
}

enum Markers {
    JPEG = "/9j/",
    PNG = "iVBORw0KGgoAAAANSUhEUgAA",
    XML = "<?xml",
    PDF = "%PDF",
    JSON = "{",
    ZIP = "PK",
    HTML = "<!DOCTYPE html>",
    TEXT = "data:text/plain;base64,"
}
type MarkerType = keyof typeof Markers;

function checkByMarker(base64EncodedFile: string) {
    for (let key in Markers) {
        if (base64EncodedFile.startsWith(Markers[key as keyof typeof Markers])) {
            return MIMEType[key as keyof typeof MIMEType];
        }
    }
    return null;
}

export const GetMIMEType = (base64EncodedFile: string) => {
    const markerResult =  checkByMarker(base64EncodedFile);
    if (markerResult) {
        return markerResult;
    }
    let block = base64EncodedFile.split(";");
    let contentType = block[0].split(":")[1];
    if (!Object.values(MIMEType).includes(contentType as MIMEType)) {
        // May be a base64 encoded string without file identifier.
        const buff = Buffer.from(base64EncodedFile, "base64");
        const decodedString = buff.toString("utf-8");
        const splitString = decodedString.split(",");
        contentType = splitString[0].split(";")[0].split(":")[1];
        if (!Object.values(MIMEType).includes(contentType as MIMEType)) {
            throw new Error("Failed to get MIME type.");
        }
        return contentType as MIMEType;
    };
    return contentType as MIMEType;
}