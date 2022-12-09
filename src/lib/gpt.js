const openai_key = `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`;

export async function callGpt3(prompt) {
    const url = 'https://api.openai.com/v1/engines/davinci/completions';
    const params = {
        "prompt": prompt,
        "max_tokens": 160,
        "temperature": 0.7,
        "frequency_penalty": 0.5
    };
    const headers = {
        'Authorization': `Bearer ${openai_key}`,
        'Content-Type': 'application/json',
    };

    try {
        // const response = await fetch().post(url, { json: params, headers: headers }).json();
        const response = await fetch(url, {
            method: "POST",

            headers: headers,
            body: JSON.stringify(params),
        });
        console.log(response)
        const jsonResponse = await response.json();
        console.log(jsonResponse)
        let output = `${prompt}${jsonResponse.choices[0].text}`;
        console.log(output);
        return output;
    } catch (err) {
        console.log(err);
        return null;
    }
}



export function createPrompt(name_str, date_str, nl_instruction) {

    return `
You are a tool for scheduling meeting using natural language. You will take in a natural language instruction to schedule a meeting and output a JSON representing the desired meeting, That JSON must have the following fields:

TITLE: The name of the meeting
ATTENDEES: A comma separated list of attendee names. Unless explicitly stated, the person scheduling the meeting will always be attending.
START_TIME: A timestamp string showing when the meeting would start
DURATION: An integer representing the number of minutes the meeting should last. This should be a multiple of 10. 
VIDEO: Which, if any, video chat software should be used. This can be either NONE, MEET, or ZOOM. If no one is calling in, the default should be NONE. Unless explicitly stated, we assume that no one is calling in remotely. If we need video conferencing because someone is calling in and we don't specify MEET, the default should be ZOOM. 

If any field is uncertain, set the value to UNKNOWN.

---

My name is ${name_str}. The current date is ${date_str}

General Context: Team members are myself, Alice, Bob, Charlie, David, Elaine, Fatima, and Geoffrey. We schedule meetings from 10am to 6pm.

---

Examples:

Input: Schedule a meeting at noon with myself and David over Google Meet. 
Output: {"TITLE": "Armand <> David", "ATTENDEES": "Armand, David", "START_TIME": "2022-12-08T20:00:00+0000", "DURATION": 30, "VIDEO": "MEET"}

Input: Schedule me a 1 hour meeting tomorrow with Josh, Seth and Cliff about the launch plan. Have it at 3pm.
Output: {"TITLE": "Launch planning", "ATTENDEES": "Armand, Josh, Seth, Cliff", "START_TIME": "2022-12-09T23:00:00+0000", "DURATION": 30, "VIDEO": "NONE"}

Input: Change the launch plan meeting to be at 2pm and remove Josh.
Output: {"TITLE": "Launch planning", "ATTENDEES": "Armand, Seth, Cliff", "START_TIME": "2022-12-09T22:00:00+0000", "DURATION": 30, "VIDEO": "NONE"}

Input: Schedule a 1:1 with LeBron tomorrow morning.
Output:  {"TITLE": "Armand <> LeBron", "ATTENDEES": "Armand, LeBron", "START_TIME": "2022-12-09T17:00:00+0000", "DURATION": 30, "VIDEO": "NONE"}

Input: Schedule an all-day all-hands tomorrow at 2pm. David will be calling in.
Output:     {"TITLE": "All-Hands Meeting", "ATTENDEES": "Armand, David, Josh, Seth, Cliff, Erich, LeBron, Luis", "START_TIME": "2022-12-09T22:00:00+0000", "DURATION": 480, "VIDEO": "ZOOM"}

Input: ${nl_instruction}
Output:
`
}
