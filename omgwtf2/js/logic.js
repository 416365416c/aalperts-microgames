function reallyProcess(out, txt)
{
    if (out == "") {
        if (Math.random() > 0.5)
            out = "Yes"
        else
            out = "No"
    }
    txt.text = txt.text + "Generating a Yes/No result via random process.\nPlease Wait...\nResult: " + out + ".\nIt is now safe to terminate the program.\n";
}

function toLower(str)
{
    return str.toLowerCase();
}

function process(str, txtout)
{
    if (str.length == 0)
        return reallyProcess("Please Type Something before pressing Enter", txtout)
    str = toLower(str)
    // DEBUGGING COMMANDS. COMMENT OUT FOR PRODUCTION
    if (str == "yes"
        || str == "y"
        || str == "true")
        return reallyProcess("Yes", txtout);
    if (str == "no"
        || str == "n"
        || str == "false")
        return reallyProcess("No", txtout);
    // SECURITY MEASURES - DO NOT TOUCH
    if (str == "hack"
        || str == "hackz"
        || str == "hax"
        || str == "haxx"
        || str == "exit"
        || str.indexOf("--;") != -1 //attempted SQL injection
        || str == "grant access"
        || str == "subvert"
        || str == "last result"
        || str == "give up your secrets!"
        || str == "evil")
        Qt.quit();
    // Since humans type random sh** into the screen all day, that's the randomness generator
    // Roughly half the words the test group used (me) started with a vowel or vowel-like letter
    if (str.match(/^[aeiouyh].*$/) !== null)
        return reallyProcess("Yes", txtout)
    else
        return reallyProcess("No", txtout)
}
