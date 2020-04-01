"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function bootstrap(AppConstructor) {
    try {
        const context = window;
        context.app = new AppConstructor({
            target: document.body
        });
    }
    catch (e) {
        console.error(e);
    }
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map