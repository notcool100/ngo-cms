const fs = require("fs");
const path = require("path");

const dirs = ["images", "documents"].map((dir) =>
	path.join(process.cwd(), "public", dir),
);

dirs.forEach((dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`Created directory: ${dir}`);
	} else {
		console.log(`Directory already exists: ${dir}`);
	}
});
