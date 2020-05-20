import {IZoneAttributes} from '../game-state/Zone'

export const testZoneAttributes: IZoneAttributes = {
	bosses: [{
		maxHealth: 10,
		maxMagic: 10,
		startCoords: {
			x: 7,
			y: 6,
		}
	}],
	dimensions: {
		x: 15,
		y: 15,
	},
	items: [{
		startCoords: {
			x: 1,
			y: 8,
		}
	}],
	obstacles: [{
		startCoords: {
			x: 0,
			y: 0,
		}
	}, {
		startCoords: {
			x: 10,
			y: 0,
		}
	}, {
		startCoords: {
			x: 4,
			y: 6,
		}
	}, {
		startCoords: {
			x: 3,
			y: 6,
		}
	}, {
		startCoords: {
			x: 4,
			y: 7,
		}
	}, {
		startCoords: {
			x: 3,
			y: 7,
		}
	}, {
		startCoords: {
			x: 4,
			y: 8,
		}
	}, {
		startCoords: {
			x: 3,
			y: 8,
		}
	}, {
		startCoords: {
			x: 4,
			y: 9,
		}
	}, {
		startCoords: {
			x: 3,
			y: 9,
		}
	}, {
		startCoords: {
			x: 0,
			y: 14,
		}
	}, {
		startCoords: {
			x: 14,
			y: 0,
		}
	}, {
		startCoords: {
			x: 14,
			y: 14,
		}
	}],
	portals: [{
		startCoords: {
			x: 5,
			y: 0,
		}
	}],
	stores: [{
		startCoords: {
			x: 0,
			y: 4,
		}
	}]
}
