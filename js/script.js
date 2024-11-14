// 日付を描画
function drawDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}/${month}/${day}`;

    ctx.font = "20px 'title_font1', 'title_font2', 'title_font3'";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(dateStr, canvas.width - 60, canvas.height - 30);
}

// テンプレートを描画
function drawTemplate() {
    templateImage.src = '../img/template.png';
    templateImage.onload = function () {
        ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
        if (uploadedImage) {
            drawImage(); // アップロードされた画像を描画
        }
        if (textContent) {
            drawText(textContent); // テキストを描画
        }
        drawDate(); // 日付を描画
    };
}


function createImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageUpload = document.getElementById('imageInput').files[0];
    const textInput = document.getElementById('saveButton').value;


    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // PNG画像として保存するためにリンクを作成
            const dataURL = canvas.toDataURL("image/png");
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = dataURL;
            downloadLink.download = "combined_image.png";
            downloadLink.style.display = "block";
            downloadLink.textContent = "ダウンロード";
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(imageUpload);
}
