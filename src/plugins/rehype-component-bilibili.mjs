/// <reference types="mdast" />
import { h } from "hastscript";

function isPositiveInteger(value) {
	return typeof value === "string" && /^\d+$/.test(value) && Number(value) > 0;
}

function isBooleanLike(value) {
	return value === "0" || value === "1" || value === "true" || value === "false";
}

function toSwitch(value, fallback) {
	if (!isBooleanLike(value)) return fallback;
	return value === "1" || value === "true" ? "1" : "0";
}

/**
 * Creates a responsive Bilibili iframe player.
 *
 * Markdown usage:
 * ::bilibili{bvid="BV1xx411c7mD"}
 * ::bilibili{aid="123456" cid="654321" page="1"}
 *
 * @param {Object} properties - The directive attributes.
 * @param {string} [properties.bvid] - Bilibili BV id.
 * @param {string} [properties.aid] - Bilibili AV id without the av prefix.
 * @param {string} [properties.cid] - Bilibili cid.
 * @param {string} [properties.page] - Page number.
 * @param {string} [properties.p] - Page number alias.
 * @param {string} [properties.title] - iframe title.
 * @param {string} [properties.autoplay] - 1/0 or true/false, defaults to 0.
 * @param {string} [properties.danmaku] - 1/0 or true/false, defaults to 0.
 * @param {import('mdast').RootContent[]} children - The children elements of the component.
 * @returns {import('mdast').Parent} The created Bilibili player component.
 */
export function BilibiliComponent(properties, children) {
	if (Array.isArray(children) && children.length !== 0) {
		return h("div", { class: "hidden" }, [
			'Invalid directive. ("bilibili" directive must be leaf type "::bilibili{bvid=\"BV...\"}")',
		]);
	}

	const bvid = typeof properties.bvid === "string" ? properties.bvid.trim() : "";
	const aid = typeof properties.aid === "string" ? properties.aid.trim() : "";
	const cid = typeof properties.cid === "string" ? properties.cid.trim() : "";
	const page = String(properties.page || properties.p || "1").trim();

	if (!/^BV[a-zA-Z0-9]+$/.test(bvid) && !(isPositiveInteger(aid) && isPositiveInteger(cid))) {
		return h("div", { class: "hidden" }, [
			'Invalid Bilibili directive. Use "::bilibili{bvid=\"BV...\"}" or "::bilibili{aid=\"123\" cid=\"456\"}".',
		]);
	}

	if (!isPositiveInteger(page)) {
		return h("div", { class: "hidden" }, [
			'Invalid Bilibili directive. "page" must be a positive integer.',
		]);
	}

	const query = new URLSearchParams({
		isOutside: "true",
		p: page,
		autoplay: toSwitch(properties.autoplay, "0"),
		danmaku: toSwitch(properties.danmaku, "0"),
		high_quality: "1",
	});

	if (bvid) query.set("bvid", bvid);
	if (aid) query.set("aid", aid);
	if (cid) query.set("cid", cid);

	return h("div", { class: "bilibili-video no-styling" }, [
		h("iframe", {
			src: `https://player.bilibili.com/player.html?${query.toString()}`,
			title: properties.title || "Bilibili video player",
			loading: "lazy",
			allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
			allowFullScreen: true,
			referrerPolicy: "no-referrer-when-downgrade",
		}),
	]);
}
