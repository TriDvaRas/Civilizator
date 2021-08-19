import { DataResolver } from "discord.js";
import mergeImg from "merge-img";

export async function combineImages(paths: string[], writePath: string) {

    return new Promise((res, rej) => {
        mergeImg(paths).then((image) => {
            image.write(writePath, (err, image) => {
                if (err) rej(err)
                else res(image)
            })
        })
    })
}