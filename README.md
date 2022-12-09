# Adept Frontend Project Instructions

The goal of this project is to create a calendar web application that has a natural language interface for creating and editing meetings. There should be a UI for viewing the meetings. The natural language instructions should be translated into a calendar DSL via a large language model and your app should work with that DSL.

Please add notes to `notes.md` to provide context around design decisions. This is a fairly open-ended project, so feel free to use `notes.md` to explain the scope you have chosen (i.e. what should and shouldn't work). There is a lot to be done at a startup like Adept and choosing which problems to solve and which not to is an important skill.

By default we will use `npm install` && `npm run start` to test the completed project. If there are different instructions we should follow, please add them to `notes.md`

## Must-have requirements

- There must be a UI for viewing the meetings in a day or week. Whether to have a day view, week view or both is up to you.
- There must be a UI for viewing the details of a specific meeting
- There must be the ability to use natural language to create meetings
- There must be the ability to change the details of a meeting. This can be done with traditional UI elements (if you would like to do this with natural language, note that it requires some additional prompt setup work to ensure that the model sees the original details of the meeting to be changed). 
- This project must be implemented in Javascript or Typescript


## Non-requirements

Data persistence and ability for multiple people to see the same calendar are not requirements for this project. Unless otherwise instructed by you through `notes.md`, this will be tested in the context of one person starting up the project, creating and editing meetings, and expecting the calendar state to persist for the duration of the testing session.

This `create-react-app` base is provided as a convenience, but you are free to change anything about it or discard it. Just make sure to have instructions in `notes.md` for how to setup and test your project.

You do not need to spend time thinking about timezones. 

## GPT-3 Usage

We have provided an example set of natural language commands in `hardcoded.json` with a hardcoded DSL output. This can be used for initial testing. The user's name in these examples is Alice. 

We have also provided a library in `src/lib/gpt.js` that will call the GPT-3 API to output DSL based on natural language input. There is a prompt in that library. If you would like, you can change the prompt and/or DSL.

There is a set of commands that we will use verbatim in `examples.txt` when testing the project. These commands have been confirmed to give correct DSL output from the GPT-3 API. If you edit the prompt, please update `examples.txt` to have a new golden set of examples for testing.

This is a project to evaluate frontend ability and does not expect any LLM or prompt engineering expertise. Using the provided library and examples as-is is a perfectly valid approach to this project.

### DSL

The output of the language model should be a structured output. In this case we are using a JSON-based DSL where the model outputs information about the desired state of the meeting. The DSL is best understood by reading the prompt in `src/lib/gpt.js`

The title of a meeting can be assumed to be unique and treated as an ID.



