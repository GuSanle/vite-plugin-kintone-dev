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
    message: "What kind of development do you want to do?",
    name: "type",
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
      return answers.type === "APP";
    },
  },
];

export default function userInquirer() {
  return inquirer.prompt(questions);
}
