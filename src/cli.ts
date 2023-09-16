import inquirer from "inquirer";
import type { Answers } from "inquirer";
const questions = [
  {
    type: "input",
    message: "Please enter kintone url",
    name: "kintoneUrl",
    default: "aaa.cybozu.com",
  },
  {
    type: "input",
    message: "kintone login name",
    name: "userName",
    validate: function (value: string) {
      return value ? true : "Please enter the login name";
    },
  },
  {
    type: "password",
    message: "kintone password",
    name: "passWord",
    validate: function (value: string) {
      return value ? true : "Please enter the password";
    },
  },
  {
    type: "list",
    message: "On which platform is your development being applied? ",
    name: "type",
    choices: [
      { name: "Desktop", value: "DESKTOP" },
      { name: "Mobile", value: "MOBILE" },
    ],
    default: "DESKTOP",
  },
  {
    type: "list",
    message: "What kind of development do you want to do?",
    name: "platform",
    choices: [
      { name: "Portal", value: "PORTAL" },
      { name: "Custom App", value: "APP" },
    ],
    default: "PORTAL",
  },
  {
    type: "input",
    message: "Please enter the app id",
    name: "appId",
    default: undefined,
    when(answers: Answers) {
      return answers.platform === "APP";
    },
  },
  {
    type: "list",
    message: "Is React?",
    name: "isReact",
    choices: [
      { name: "react", value: "true" },
      { name: "others", value: "false" },
    ],
    default: "false",
  },
  {
    type: "list",
    message: "need auto upload?",
    name: "upload",
    choices: [
      { name: "upload", value: "true" },
      { name: "not upload", value: "false" },
    ],
    default: "false",
  },
];

export default function userInquirer() {
  return inquirer.prompt(questions);
}
