function sendImageToServlet() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append("image", blob, "canvas_image.png");

        // サーブレットにデータを送信
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "../../../../../src/main/java/servlet/ImageUploadServlet.java", true); // サーブレットのURLを指定
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log("Image successfully sent to the servlet!");
            } else {
                console.error("Failed to send image to the servlet.");
                console.error(xhr.status);
            }
        };
        xhr.send(formData);
    }, 'image/png');
}