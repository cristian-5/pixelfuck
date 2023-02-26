
const hex = c => parseInt(c, 16);
const coordinates = n => [ n >> 4, n & 0xF ];

const matching = {
	'(': ')', ')': '(',
	'[': ']', ']': '[',
	'{': '}', '}': '{'
};

function pixelfuck(code) {
	const LIMIT = 2 ** 16;
	const S = 16, s = [], output = [];
	const D = new Array(S).fill(null).map(_ => new Uint8Array(S).fill(0));
	let i = 0, l = 0, x = 0, y = 0, z = 0; delay = 500;
	while (i < code.length && l++ < LIMIT) {
		if (/[0-9A-F]/i.test(code[i])) {
			z = ((z << 4) | hex(code[i++])) & 0xFF;
			continue;
		}
		switch (code[i]) {
			case '§': return output;
			case '`': s.push(s[s.length - 1]); break;
			case '°': D[y][x] = s.pop(); break;
			case ',': s.push(0); break;
			case '.': D[y][x] = z; z = 0; break;
			case ':': s.push(z); z = 0; break;
			case ';': output.push({ matrix: structuredClone(D), delay }); break;
			case '"': s.push((s.pop() + 1) & 0xFF); break;
			case "'": s.push((s.pop() - 1) & 0xFF); break;
			case '+': s.push((s.pop() + s.pop()) & 0xFF); break;
			case '-': s.push((s.pop() - s.pop()) & 0xFF); break;
			case '*': s.push((s.pop() * s.pop()) & 0xFF); break;
			case '/': s.push((s.pop() / s.pop()) & 0xFF); break;
			case '%': s.push((s.pop() % s.pop()) & 0xFF); break;
			case '&': s.push((s.pop() & s.pop()) & 0xFF); break;
			case '|': s.push((s.pop() | s.pop()) & 0xFF); break;
			case '!': s.push(s.pop() == 0 ? 1 : 0); break;
			case '@': delay = s.pop() * 200; break; // todo: maybe there is a better way to do this
			case '$': s.pop(); break;
			case '#': [ x, y ] = coordinates(s.pop()); break;
			case '=': D[y][x] = s.pop(); break;
			case '>': x = (x + 1) & 0xF; break;
			case '<': x = (x - 1) & 0xF; break;
			case '^': y = (y - 1) & 0xF; break;
			case '_': y = (y + 1) & 0xF; break;
			case '\\': D.forEach(e => e.fill(0xF0)); break;
			case '(': case '[': case '{': {
				if (s[s.length - 1] !== 0) break;
				const b = code[i], e = matching[s];
				let level = 0;
				while (i < code.length) {
					if (code[i] === b) level++;
					if (code[i] === e) level--;
					if (level === 0) break;
					i++;
				}
			} break;
			case ')': case ']': case '}': {
				if (s[s.length - 1] === 0) break;
				const e = code[i], b = matching[e];
				let level = 0;
				while (i >= 0) {
					if (code[i] === e) level++;
					if (code[i] === b) level--;
					if (level === 0) break;
					i--;
				}
			} break;
		}
		i++;
	}
	if (l >= LIMIT) console.error("execution limit reached");
	return output;
}
