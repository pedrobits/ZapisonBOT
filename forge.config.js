module.exports = {
  packagerConfig: {
    icon: __dirname + "/src/Icon.ico", // no file extension required
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        icon: __dirname + "/src/Icon.ico",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {
        icon: __dirname + "/src/Icon.ico",
      },
    },
  ],
};
