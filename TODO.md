# memup

## Currently working on:

-   Adding content
-   Non destructive imports with conflict management

## Import/Export

-   [ ] When a mem is fine, and folders are different, they should be merged somehow
-   [ ] Improve the conflict detection
    -   [ ] Check if the mem is actually the same and ignore it from the import
    -   [ ] Check if the mem can be merged, like if a folder is different merge that, or if a hint is added, if checks were previously missing and this one adds just that stuff like these
-   [ ] Conflict Interface to allow manual merge/save of mems
-   [ ] exporting mems (not the backup) will double them up if they're in 2 folders

## Kanji reading game

-   [ ] take all long term memory mems with kanji
-   [ ] present them without the furigana, kanji only
-   [ ] hiragana input
-   [ ] record fail/success somewhere else, use the same logic to push mems through levels and all

## Content

-   [ ] Find a way to use a github folder as a source for import, allow to delete mems by folders/subfolders
-   [ ] related mems, have a way to point which are related, save the ids, and on import, match ids and fill up accodingly (imagine having いく and 行きます being the actual same, so if you pick in the answers, either should be fine)

## General

-   [ ] mobile tests
-   [ ] BUG: adding a mem, hiragana gets reset if toying with folders
-   [ ] delete button in the edit form
-   [ ] folders
    -   [ ] should be tree like and less cumbersome to pick
    -   [ ] maybe have folders as external to the mems themselves
-   [ ] Stats and graphs everywhere
    -   [ ] At the end of a sesh (how many mems moved up to long term memory, how many new mems, time of the sesh, how many in the sesh, state of mems, etc..)
    -   [ ] homepage with an overall view of everything

## Korean

-   [ ] Refactor everything so it's not so Japanese specific
    -   [ ] Kanji/Furigana is really just a string with a tagline
    -   [ ] Kanji/Hungul detection (maybe more?)
    -   [ ] Furigana interface to be more tagline
    -   [ ] Find everywhere where it's japanese and adapt that too
-   [ ] Add the 100 most used korean words https://flexiclasses.com/korean/common-korean-words/
