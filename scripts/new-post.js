/* This is a script to create a new post markdown file with front-matter */

import fs from "node:fs";
import path from "node:path";

function getDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, "0");
	const day = String(today.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const args = process.argv.slice(2);

if (args.length === 0) {
	console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`);
	process.exit(1); // Terminate the script and return error code 1
}

let folderName = args[0];

// Remove .md or .mdx extension if present (since we're creating a folder)
const fileExtensionRegex = /\.(md|mdx)$/i;
if (fileExtensionRegex.test(folderName)) {
	folderName = folderName.replace(fileExtensionRegex, "");
}

const targetDir = "./src/content/posts/";
const folderPath = path.join(targetDir, folderName);
const fullPath = path.join(folderPath, "index.md");

// Check if folder already exists
if (fs.existsSync(folderPath)) {
	console.error(`Error: Folder ${folderPath} already exists`);
	process.exit(1);
}

// Create the folder for the post
fs.mkdirSync(folderPath, { recursive: true });

const content = `---
title: ${folderName}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
series: ""
---
`;

// Write index.md inside the folder
fs.writeFileSync(fullPath, content);

console.log(`Post ${fullPath} created`);