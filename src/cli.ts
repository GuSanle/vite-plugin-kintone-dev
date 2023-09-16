import { input, password, select } from "@inquirer/prompts";

export default async function userInquirer(command: "build" | "serve") {
  //域名
  const q1 = { message: "Please enter kintone url", default: "aaa.cybozu.com" };
  const kintoneUrl = await input(q1);

  //用户名
  const q2 = {
    message: "kintone login name",
    validate: function (value: string) {
      return value ? true : "Please enter the login name";
    },
  };
  const userName = await input(q2);

  //密码
  const q3 = {
    message: "kintone password",
    validate: function (value: string) {
      return value ? true : "kintone password";
    },
  };
  const passWord = await password(q3);

  //desktop还是mobile
  const q4 = {
    message: "On which platform is your development being applied?",
    default: "DESKTOP",
    choices: [
      {
        name: "Desktop",
        value: "DESKTOP",
        description: "Desktop customize",
      },
      {
        name: "Mobile",
        value: "MOBILE",
        description: "",
      },
    ],
  };
  const type = await select(q4);

  //首页自定义还是应用自定义
  const q5 = {
    message: "What kind of development do you want to do?",
    default: "PORTAL",
    choices: [
      {
        name: "Portal",
        value: "PORTAL",
        description: "PORTAL customize",
      },
      {
        name: "Custom App",
        value: "APP",
        description: "APP customize",
      },
    ],
  };
  const platform = await select(q5);

  //应用id
  let appId;
  if (platform === "APP") {
    const q6 = {
      message: "Please enter the app id",
    };
    appId = await input(q6);
  }

  //react？
  const q7 = {
    message: "Is this a React project?",
    default: "false",
    choices: [
      {
        name: "No",
        value: "false",
        description: "Not a react project",
      },
      {
        name: "Yes",
        value: "true",
        description: "React project",
      },
    ],
  };
  const isReact = await select(q7);

  //build时是否自动上传
  let upload;
  if (command === "build") {
    const q8 = {
      message: "Auto upload when build?",
      default: "false",
      choices: [
        {
          name: "Auto upload",
          value: "true",
          description: "Auto upload",
        },
        {
          name: "Not auto upload",
          value: "false",
          description: "Not auto upload",
        },
      ],
    };
    upload = await select(q8);
  }

  return {
    kintoneUrl,
    userName,
    passWord,
    type,
    platform,
    appId,
    upload,
    isReact,
  };
}
