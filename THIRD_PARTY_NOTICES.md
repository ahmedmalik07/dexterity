# Third-party notices

Dexterity uses Electron and the dependencies listed in `package.json` and `package-lock.json`, under their respective licenses.

The local speech detector includes:

- [vad-web](https://github.com/ricky0123/vad), version 0.0.30, ISC license. [License](third-party-licenses/vad-web.txt).
- [Silero VAD](https://github.com/snakers4/silero-vad), V5 model distributed by vad-web, MIT license. [License](third-party-licenses/silero-vad.txt).
- [ONNX Runtime Web](https://github.com/microsoft/onnxruntime), version 1.22.0, MIT license. [License](third-party-licenses/onnxruntime.txt).

Generated speech runtime assets are prepared locally by `scripts/prepare-voice.cjs` during installation and included in desktop builds. Their licenses are included with the source and packaged application.
