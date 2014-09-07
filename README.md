# The Magic Spambot-Resistant Email Link Generator

Enter your email address and optional display text into this simple, handy tool and it will magically output scrambled JavaScript code that helps prevent spambots from harvesting your email address from your blog or personal site.

## What Does It Do?

**The Magic Spambot-Resistant Email Link Generator (MSRELG)** accepts an email address and optional display text from the user. It takes this information outputs HTML and JavaScript code consisting of two components:

* a span tag with a uniquely generated id that contains a text-only version of the email address with the @ symbol changed to " at " and all .'s changed to " dot " in case the user viewing the destination site does not have JavaScript enabled.
* an Immediately-Invoked Function Expression (IFFE) that contains a series of scrambled, randomized variables with small chunks of the final output split up among them. The content of the span is replaced with the concatenated output of these variables to create a functioning email link for users with JavaScript enabled. 

## How To Use It

Just copy the outputted code and paste it into the HTML of your blog or personal site. This will create a safe, functioning email link for users with JavaScript enabled and an accessible fallback for users without JavaScript turned on.

## Notes

Aside from its unique id, the outputted span tag will also have the class of "magicEmail" for the purposes of styling with CSS.
