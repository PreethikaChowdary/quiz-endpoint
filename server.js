// server.js
if (formAction) submitUrl = new URL(formAction, url).toString();
} catch (e) {}
}


// If still no submitUrl, try to evaluate a common global var pattern
if (!submitUrl) {
try {
const possible = await page.evaluate(() => {
return window.submitUrl || window.SUMMIT_URL || null;
});
if (possible) submitUrl = new URL(possible, window.location.href).toString();
} catch (e) {}
}


// If we haven't computed an answer, try to detect a visible numeric question in the DOM
if (!answerPayload) {
// Heuristic: look for all numbers in page and sum them — this is only a last resort & example
const allText = (await page.content()) || '';
const nums = Array.from(allText.matchAll(/[-+]?[0-9]*\.?[0-9]+/g)).map(m => Number(m[0]));
if (nums.length >= 1) {
const candidate = nums.reduce((a,b)=>a+b,0);
answerPayload = { email, secret, url, answer: candidate };
}
}


// Final fallback sample answer
if (!answerPayload) answerPayload = { email, secret, url, answer: 'unable-to-automatically-solve' };


if (submitUrl) {
console.log('Submitting answer to:', submitUrl);
try {
const postRes = await axios.post(submitUrl, answerPayload, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
console.log('Submit response:', postRes.status, postRes.data);


// If we receive a new URL to follow, continue until no more or deadline
let next = postRes.data && postRes.data.url;
while (next && Date.now() < deadline) {
console.log('Following next URL:', next);
await page.goto(next, { waitUntil: 'networkidle' });
// Very simple handling — in practice you'd re-run extraction/submit logic
break; // implement full loop if needed
}
} catch (err) {
console.error('Error posting answer:', err?.message || err);
}
} else {
console.warn('No submit URL discovered. Computed payload (not sent):', answerPayload);
}


} catch (err) {
console.error('solveSequence error:', err?.message || err);
} finally {
try { await browser.close(); } catch (e) {}
}
}


// graceful shutdown
process.on('SIGTERM', () => { console.log('SIGTERM; exiting'); process.exit(0); });
process.on('SIGINT', () => { console.log('SIGINT; exiting'); process.exit(0); });


app.listen(APP_PORT, () => console.log(`Server listening on port ${APP_PORT}`));
