const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let templateImage = new Image();
let uploadedImage = null; // アップロードされた画像を保存
let textContent = ''; // テキスト内容を保存

// 日付を描画
function drawDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const date = String(today.getDate()).padStart(2, '0');

	var dayOfWeekStrJP = ["日", "月", "火", "水", "木", "金", "土"];
	var num_date = new Date(year, month - 1, date);

	const day = dayOfWeekStrJP[num_date.getDay()];
	const monthStr = `${month}`;
	const dateStr = `${date}`;
	const dayStr = `${day}`;

	ctx.font = "20px 'title_font1', 'title_font2', 'title_font3'";
	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';
	ctx.fillText(monthStr, canvas.width - 18, canvas.height - 275);
	ctx.fillText(dateStr, canvas.width - 18, canvas.height - 218);
	ctx.fillText(dayStr, canvas.width - 18, canvas.height - 150);
}

//うちわを描画
function drawUchiwa() {
	// 画像の定義　　　　赤の部分が画像ファイル読込の常套手段です
	var uchiwaImage = new Image();                // 画像ファイルの画像オブジェクトが生成
	// 画像を canvas1 に表示
	uchiwaImage.onload = function() {             // 画像ファイルが読み込まれたときの処理
		ctx.drawImage(uchiwaImage, -35, 120);
	}
	uchiwaImage.src = 'img/uchiwa.png';                 // 画像ファイルの読込
}

// テンプレートを描画
function drawTemplate() {
	templateImage.src = 'img/template.png';
	templateImage.onload = function() {
		ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
		if (uploadedImage) {
			drawImage(); // アップロードされた画像を描画
		}
		if (textContent) {
			drawText(textContent); // テキストを描画
		}
		drawDate(); // 日付を描画
		drawUchiwa();//うちわを描画
	};
}

// 画像を描画
function drawImage() {
	const targetHeight = canvas.height / 2;
	const aspectRatio = uploadedImage.width / uploadedImage.height;
	const targetWidth = targetHeight * aspectRatio;
	const offsetX = (canvas.width - targetWidth) / 2;

	// 画像を描画
	ctx.drawImage(uploadedImage, offsetX, 0, targetWidth, targetHeight);

	// 四辺をぼかすためのグラデーションを作成
	const edgeWidth = 20; // ぼかしの幅

	// 上側のぼかし
	let gradient = ctx.createLinearGradient(0, 0, 0, edgeWidth);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(offsetX, 0, targetWidth, edgeWidth);

	// 下側のぼかし
	gradient = ctx.createLinearGradient(0, targetHeight - edgeWidth, 0, targetHeight);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
	gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
	ctx.fillStyle = gradient;
	ctx.fillRect(offsetX, targetHeight - edgeWidth, targetWidth, edgeWidth);

	// 左側のぼかし
	gradient = ctx.createLinearGradient(0, 0, edgeWidth, 0);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
	gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
	ctx.fillStyle = gradient;
	ctx.fillRect(offsetX, 0, edgeWidth, targetHeight);

	// 右側のぼかし
	gradient = ctx.createLinearGradient(targetWidth - edgeWidth, 0, targetWidth, 0);
	gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
	gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');
	ctx.fillStyle = gradient;
	ctx.fillRect(offsetX + targetWidth - edgeWidth, 0, edgeWidth, targetHeight);

	// 元の描画モードに戻す
	ctx.globalCompositeOperation = 'source-over';
}

// テキストを描画
function drawText(text) {
	ctx.font = "20px 'title_font1', 'title_font2', 'title_font3'";
	ctx.fillStyle = "black";

	const lineHeight = 30;
	const maxLines = Math.floor(canvas.height / 2 / lineHeight);
	const charsPerLine = Math.min(maxLines, text.length);
	const columnX = canvas.width - 50;

	let startX = columnX - 2;
	let startY = canvas.height / 2 + 24;

	for (let i = 0; i < text.length; i++) {
		if (i % charsPerLine === 0 && i !== 0) {
			startX -= 33;
			startY = canvas.height / 2 + 24;
		}
		ctx.fillText(text[i], startX, startY);
		startY += lineHeight;
	}
}

// ページがロードされた時にテンプレートを描画
window.onload = function() {
	drawTemplate();
};

// 選択してアップロードされた画像を配置
document.getElementById('imageInput').addEventListener('change', function(event) {
	const file = event.target.files[0];
	const reader = new FileReader();

	reader.onload = function(e) {
		uploadedImage = new Image();
		uploadedImage.onload = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawTemplate(); // テンプレートを再描画し、画像とテキストを再配置
		};
		uploadedImage.src = e.target.result;
	};

	if (file) {
		reader.readAsDataURL(file);
	}
});

// 作成ボタン押下でテキストを配置
document.getElementById('saveButton').addEventListener('click', function() {
	textContent = document.querySelector('textarea[name="text"]').value;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawTemplate(); // テンプレートを再描画し、画像とテキストを再配置
});

// マウスでお絵かき
const colorPicker = document.getElementById('colorPicker');
const lineWidthSlider = document.getElementById('lineWidth');

canvas.addEventListener('mousedown', () => {
	drawing = true;
});

canvas.addEventListener('mouseup', () => {
	drawing = false;
	ctx.beginPath();
});

canvas.addEventListener('mousemove', draw);

function draw(event) {
	if (!drawing) return;

	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	ctx.lineWidth = lineWidthSlider.value; // スライダーで選択された線の太さを設定
	ctx.lineCap = 'round';
	ctx.strokeStyle = colorPicker.value; // カラーピッカーで選択された色を設定

	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(x, y);
}
