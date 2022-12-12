# Adept Frontend Project Instructions

The goal of this project is to create a calendar web application using a natural language interface. Meetings should be shown in the UI. Changes to the calendar are expressed by users in English. A large language model converts the natural language into an easy to parse command structure. Your app should work with this domain specific language (DSL).

Please add notes to `notes.md` to provide context around design decisions. This is an open-ended project, so feel free to use `notes.md` to explain the scope you have chosen (e.g. what should and shouldn't work). There is a lot to be done at a startup like Adept and choosing which problems to solve and which not to is an important skill.

By default, we will use `npm install` && `npm run start` to test the completed project. If there are different instructions we should follow, please add them to `notes.md`

## Must-have requirements

- The UI should show meetings for a day or a week. Whether to have a day view, week view or both is up to you.
- The user should be able to see details of a specific meeting.
- Natural language should be entered by the user in order to create meetings. 
- Users should also be able to change the details of specific meetings. This should be done with traditional UI elements. (If you would like to do this with natural language, note that the existing function won't work. It will require some additional prefix prompt setup work to ensure that the model sees the original details of the meeting to be changed). 
- Either Javascript or Typescript should be used.

## Non-requirements

We don't need multiuser capabilities or data persistence. Everything will be in the same timezone. Unless otherwise instructed by you through `notes.md`, this will be tested in the context of one person starting up the project, creating and editing meetings, and expecting the calendar state to last for the duration of the testing session.

This `create-react-app` base is provided as a convenience, but you are free to change anything about it or discard it. Just make sure to have instructions in `notes.md` for how to set up and test your project.

## GPT-3 Usage

We have provided an example set of natural language commands in `src/lib/hardcoded.json` with the hardcoded DSL output. This can be used for testing. The user's name in these examples is Adept. Note that the hardcoded nature of this output means that all dates are relative to December 9th, 2022.

We have also provided a library in `src/lib/gpt.js` that will call the GPT-3 API to produce our DSL-based commands. There is a `askModelForDslMeeting` function that calls the GPT-3 API. There is an API-compatible `askModelForDslMeetingHardcoded` function that only uses the `hardcoded.json`. There is a prefix prompt in that library. If you would like, you can change the prompt and/or DSL. 

There is the set of commands that we will use verbatim in `examples.txt` when testing the project (these are identical to the prompts in `hardcoded.json`). These commands have been confirmed to give correct DSL output from the GPT-3 model. If you edit the prompt, please update `examples.txt` to have a new golden set of examples for testing.

This is a project to evaluate frontend ability and does not expect any LLM or prompt engineering expertise. Using the provided library and examples as-is is a perfectly valid approach to this project.

### DSL

The output of the language model should be a structured output. In this case we are using a JSON-based DSL where the model outputs information about the desired state of the meeting. The DSL is best understood by reading the prompt in `src/lib/gpt.js`.

The title of a meeting can be assumed to be unique and can be treated as an ID.

