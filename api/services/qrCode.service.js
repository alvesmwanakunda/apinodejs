const QRCode = require('qrcode');
const { createCanvas, loadImage } = require('canvas');

module.exports = {


    user_qrcode: async(user, center_image, width, cwidth)=>{

        const canvas = createCanvas(width, width);
        QRCode.toCanvas(
            canvas,
            user,
            {
                errorCorrectionLevel:"H",
                margin:1,
                color:{
                    dark: "#243665",
                    light: '#ffffff',
                },
            }
        );

        const ctx = canvas.getContext("2d");
        const img = await loadImage(center_image);
        const wrh = img.width/img.height;
        const newWidth = canvas.width;
        const newHeight = newWidth / wrh;
        if(newHeight > canvas.height){
            newHeight = canvas.height;
            newWidth=newHeight * wrh;
        }
        const xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
        const yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
        //const xOffset = img.width/2 - canvas.width/2;
        //const yOffset = img.height/2 - canvas.height/2;
        

        const center = (width - cwidth)/2;
        ctx.drawImage(img,40, 43, 40, 40);
        return canvas.toDataURL("image/png");
    },

    cadeau_qrcode: async(cadeau, center_image, width, cwidth)=>{

        const canvas = createCanvas(width, width);
        QRCode.toCanvas(
            canvas,
            cadeau,
            {
                errorCorrectionLevel:"H",
                margin:1,
                color:{
                    dark: "#243665",
                    light: '#ffffff',
                },
            }
        );

        const ctx = canvas.getContext("2d");
        const img = await loadImage(center_image);
        const wrh = img.width/img.height;
        const newWidth = canvas.width;
        const newHeight = newWidth / wrh;
        if(newHeight > canvas.height){
            newHeight = canvas.height;
            newWidth=newHeight * wrh;
        }
        const xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
        const yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
        const center = (width - cwidth)/2;
        //ctx.drawImage(img,xOffset, yOffset, newWidth, newHeight);
        ctx.drawImage(img,40, 43, 40, 40);
        return canvas.toDataURL("image/png");
    },

    avoir_qrcode: async(cadeau, center_image, width, cwidth)=>{

        const canvas = createCanvas(width, width);
        QRCode.toCanvas(
            canvas,
            cadeau,
            {
                errorCorrectionLevel:"H",
                margin:1,
                color:{
                    dark: "#243665",
                    light: '#ffffff',
                },
            }
        );

        const ctx = canvas.getContext("2d");
        const img = await loadImage(center_image);
        const wrh = img.width/img.height;
        const newWidth = canvas.width;
        const newHeight = newWidth / wrh;
        if(newHeight > canvas.height){
            newHeight = canvas.height;
            newWidth=newHeight * wrh;
        }
        const xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
        const yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
        const center = (width - cwidth)/2;
        //ctx.drawImage(img,xOffset, yOffset, newWidth, newHeight);
        ctx.drawImage(img,40, 43, 40, 40);
        return canvas.toDataURL("image/png");
    }


}