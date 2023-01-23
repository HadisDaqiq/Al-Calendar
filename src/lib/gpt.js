import hardcoded from './hardcoded.json'


const openai_key = `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`;

/**
 * This builds the prefix of the prompt passed into GPT-3. This is where the DSL format is defined.
 * @param name_str The name of the user so that meetings can include the user in the Title and the Attendees
 * @param natural_language_command The natural language command written by the user
 * @return {string} The prompt prefix that should be sent to GPT-3
 */
export function createPromptPrefix(name_str, natural_language_command) {
    let today = new Date();
    const [todayStr] = today.toISOString().split('T');
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const [tomorrowStr] = tomorrow.toISOString().split('T');

    return `
You are a tool for scheduling meeting using natural language. You will take in a natural language instruction to schedule a meeting and output a JSON representing the desired meeting, That JSON must have the following fields:

TITLE: The name of the meeting
ATTENDEES: A comma separated list of attendee names. Unless explicitly stated, the person scheduling the meeting will always be attending.
START_TIME: A timestamp string showing when the meeting would start
DURATION: An integer representing the number of minutes the meeting should last. This should be a multiple of 10. Meetings should default to 30 minutes unless otherwise stated.
VIDEO: Which, if any, video chat software should be used. This can be either NONE, MEET, or ZOOM. If no one is calling in, the default should be NONE. Unless explicitly stated, we assume that no one is calling in remotely. If we need video conferencing because someone is calling in and we don't specify MEET, the default should be ZOOM. 

If any field is uncertain, set the value to UNKNOWN.

---

My name is ${name_str}. The current date is ${todayStr}

General Context: Team members are myself, Alice, Bob, Charlie, David, Elaine, Fatima, Geoffrey. We schedule meetings from 9am to 6pm.

---

Examples:

1. Input: Schedule a 45 minute meeting at noon with myself and David over Google Meet. 
1. Output: {"TITLE": "${name_str} <> David", "ATTENDEES": "${name_str}, David", "START_TIME": "${todayStr}T12:00:00", "DURATION": 45, "VIDEO": "MEET"}

2. Input: Schedule me a 1 hour meeting tomorrow with Alice, Bob, Fatima and Geoffrey about the launch plan. Have it at 3pm.
2. Output: {"TITLE": "Launch planning", "ATTENDEES": "${name_str}, Alice, Bob, Fatima, Geoffrey", "START_TIME": "${tomorrowStr}T15:00:00", "DURATION": 60, "VIDEO": "NONE"}

3. Input: Change the launch plan meeting to be at 2pm and remove Bob.
3. Output: {"TITLE": "Launch planning", "ATTENDEES": "${name_str}, Alice, Fatima, Geoffrey", "START_TIME": "${tomorrowStr}T14:00:00", "DURATION": 30, "VIDEO": "NONE"}

4. Input: Schedule a 1:1 with Elaine tomorrow morning.
4. Output: {"TITLE": "${name_str} <> Elaine", "ATTENDEES": "${name_str}, Elaine", "START_TIME": "${tomorrowStr}T10:00:00", "DURATION": 30, "VIDEO": "NONE"}

5. Input: Schedule an all-day all-hands tomorrow at 2pm. David will be calling in.
5. Output: {"TITLE": "All-Hands Meeting", "ATTENDEES": "${name_str}, Alice, Bob, Charlie, David, Elaine, Fatima, Geoffrey", "START_TIME": "${tomorrowStr}T14:00:00", "DURATION": 240, "VIDEO": "ZOOM"}

6. Input: ${natural_language_command}
6. Output:`
}

/**
 * A function to make API calls against the GPT-3 API
 * @param prompt Any string prompt
 * @return An object with the shape of the meeting DSL if everything works. null if anything does not work.
 */
export async function callGpt3(prompt) {
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
        "prompt": prompt,
        "max_tokens": 160,
        "temperature": 0,
        "frequency_penalty": 0.5
    };
    const headers = {
        'Authorization': `Bearer ${openai_key}`,
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            method: "POST",

            headers: headers,
            body: JSON.stringify(params),
        });
        // console.log(response)
        const jsonResponse = await response.json();
        // console.log(jsonResponse)
        let output = `${prompt}${jsonResponse.choices[0].text}`;
        // console.log(output);
        let dsl_out_txt = parseGpt3Output(output);
        // console.log("dsl");
        // console.log(dsl_out_txt);
        let dsl_out_json = JSON.parse(dsl_out_txt);
        // console.log("dsl parsed");
        console.log(dsl_out_json);
        return dsl_out_json;
    } catch (err) {
        console.log(err);
        return null;
    }
}

/**
 * Parse the output of the GPT-3 response into an object
 * @param gptOutput The string output of GPT-3. This should be the initial prefix + the generation
 * @return {string} The DSL meeting JSON as a string
 */
export function parseGpt3Output(gptOutput) {

    // TODO: If you change the prompt, make sure the parsing logic is still correct!
    const prefix = '6. Output:';
    // console.log(gptOutput)
    const lines = gptOutput.split('\n');
    const outputLine = lines.find(line => line.startsWith(prefix));
    const prefixIndex = outputLine.indexOf(prefix);
    return outputLine.substring(prefixIndex + prefix.length);
}

/**
 * This takes in a natural language command as well as the name of the user and calls
 * the GPT-3 API to return a DSL representation of the desired meeting.
 * @param natural_language_command The command the user input
 * @param user The name of the user (required for the model to generate accurate meeting names and attendees)
 * @return An object with the shape of the DSL (usually - GPT-3 isn't perfect). If there is an error during the API call or when parsing the model output, returns null.
 */
export function askModelForDslMeeting(natural_language_command, user) {
    let prefix = createPromptPrefix(user, natural_language_command);
    let dslOutput = callGpt3(prefix);
    return dslOutput
}

/**
 * An equivalent function to askModelForDslMeeting that uses hardcoded.json.
 * @param natural_language_command The command the user input
 * @param user The name of the user. This is ignored and is just present to make the API identical to askModelForDslMeeting. The user is hardcoded as 'Adept' in these examples.
 * @return Either an object with the shape of the DSL or null if the input does not match any hardcoded examples.
 */
export function askModelForDslMeetingHardcoded(natural_language_command, user) {
    const match = hardcoded.find(obj => obj.input === natural_language_command);
    if (match) {
        return match.output;
    }
    // If no matching command was found, log the error and return undefined.
    console.error("No matching command was found in the set of hardcoded examples. Please confirm that the command text matches exactly.");
    return null
}


// let output = askModelForDslMeeting("Create a 45 minute zoom meeting on December 9th at 10am about the product launch. Include Elaine and Fatima", "Adept");
// console.log(output);