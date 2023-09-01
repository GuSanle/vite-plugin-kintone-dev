# vite-plugin-kintone-dev

这是一个vite插件，用于解决在kintone中，无法使用esmodule，而导致无法使用vite来进行开发的问题。

你只需要安装这个插件，然后在vite.config.js中配置一下，就可以使用vite进行开发了。享受vite带来的快速开发体验吧！

遗留问题：
生成的代码用ssl？还是不用？ssl的话需要先安装basicSsl，并且需要第一步跳过安全检查。