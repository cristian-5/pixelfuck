
const S = 16, C = 30;

const palette = [
	"16171A", "7F0622", "D62411", "FF8426",
	"FFD100", "FAFDFF", "FF80A4", "FF2674",
	"94216A", "430067", "234975", "68AED4",
	"BFFF3C", "10D275", "007899", "002859",
];

function setup() {
	createCanvas(S * C, S * C).parent("#top-section");
	background("#" + palette[0]);
	noStroke();
	noLoop();
}

let frames = [];

function draw() {
	if (frames.length === 0) return;
	background("#" + palette[0]);
	const frame = frames.shift();
	for (let i = 0; i < S; i++) {
		for (let j = 0; j < S; j++) {
			fill(colour(frame.matrix[i][j]));
			rect(j * C, i * C, C, C);
		}
	}
	setTimeout(draw, frame.delay);
}

const colour = n => "#" + ((n >> 4) === 0 ? palette[n & 0xF] : "000000");
