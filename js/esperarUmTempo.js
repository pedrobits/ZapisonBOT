const esperarPorTempo = (tempo) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, tempo);
	});
};

module.exports = esperarPorTempo;