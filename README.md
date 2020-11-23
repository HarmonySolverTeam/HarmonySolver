# HarmonySolver

## Table of contents
* [Installation](#installation)
    * [Prerequisites](#prerequisites)
    * [Installation step by step](#installation-step-by-step)
* [How to use](#how-to-use)
    * [Exercises with given harmonic functions](#exercises-with-given-harmonic-functions)
    * [Exercises with given figured bass](#exercises-with-given-figured-bass)
    * [Exercises with given soprano melody](#exercises-with-given-soprano-melody)
## Installation

#### Prerequisites

* Musescore 3.X (plugin was tested with the highest version 3.5.0.13199, but it should work on every 3.X version)
* Windows (this plugin should also work with Linux systems, but it was not fully tested on Linux distributions)

#### Installation step by step

1. Open MuseScore and go to Edit -> Preferences
![Alt text](./photos/1.png?raw=true "Title")

2. In tab "General" under "Folders" find path for "Plugins"
![Alt text](./photos/2.png?raw=true "Title")

3. Copy whole "harmonySolver" folder to this path
![Alt text](./photos/3.png?raw=true "Title")

4. Restart MuseScore and go to Plugins -> Plugin Manager...
![Alt text](./photos/4.png?raw=true "Title")

5. harmonysolver should appear on the left. Tick checkbox next to it and press ok. If harmonysolver is not visible, press "Reload Plugins" button.
You can also set here keyboard shortcut for harmonysolver
![Alt text](./photos/5.png?raw=true "Title")

6. After that, you can use harmonysolver plugin by clicking Plugins ->HarmonySolver
![Alt text](./photos/6.png?raw=true "Title")

## How to use
Plugin solves three types of exercises connected with functional harmony:
* exercises with given harmonic functions
* exercises with given figured bass
* exercises with given soprano melody

It generates four-part harmonization satisfying given input according to
functional harmony rules.

#### Exercises with given harmonic functions
To solve this type of exercises open a tab called "Harmonics".

You can use three buttons: Import - for import saved file with exercise,
Check Input - for checking of input correctness, Solve - for solving given exercise.
There will also appear a place to provide harmonic functions input.
You should use dedicated notation:

**First line** must contain key. It should be lower letter for minor keys, and upper letter for major keys.
You can also append accidentals. Examples:
* *C (= C major)*
* *e (= e minor)*
* *Db*
* *ab*
* *G#*
* *f#* 

**Second line** must contain metre. It should be provided in format: "nominator / denominator". For example:
* *3 / 4*
* *12 / 8*
* *2 / 2*

**Each next line** is treated as next measure.
Each measure contains harmonic functions separated by semicolon.
Harmonic function must satisfy scheme: <br/>**X{ extra arguments }**, where 
X is one of **T** (tonic), **S** (subdominant) or **D** (dominant).
You can also use minor harmonic functions: **To** (minor tonic), **So** (minor subdominant),
**Do** (minor dominant).
You can provide also extra arguments for harmonic function. Every argument
should be inside curly parentheses and be separated from next on by slash.
What is more every extra argument should satisfy schema: **key : value**. <br/>
List of extra arguments:
* **position** - determines which chord component should soprano note be.
Example usage: "*position: 3>*" means that soprano should be minor third of given harmonic function.
* **revolution** - determines which chord component should bass note be.
If not specified in bass will be prime of chord.
Example usage: "*revolution: 5*" means that bass should be fifth of given harmonic function.
* **system** - determines if system of result chord should be open or close.
Example usage: "*system: open*" and "*system: close*".
* **degree** - determines degree of harmonic function. Using this argument you can 
satisfy for example T<sub>III</sub> or D<sub>VII</sub>.
Example usage: "*degree: 3*" or "*degree: 6*".
* **extra** - determines extra chord components to use. For example you can
satisfy subdominant with extra sixth or dominant with extra seven.
Example usage: "*extra: 6*" means extra sixth for harmonic function, 
"*extra: 7, 9>*" means extra seventh and minor ninth fo harmonic function.
* **omit** - determines which chord components to omit.
Example usage: "*omit: 5*" means that fifth will be omitted in that chord 
and all voices will not contain fifth.
* **delay** - determines if chord components should be delayed by other chord components.
Plugin supports only single delays x - y, where interval between x and y is not bigger
than second. Plugin also supports delays like 7 - 8 or 9 - 8.
Example usage: "*delay: 4-3*" means that third should be delayed by fourth, 
"*delay: 6-5, 4-3*" means that fifth should be delayed by sixth and third by fourth.
* **down** - if used, harmonic function is down.
Example usage: "*down*".
* **isRelatedBackwards** - if used, harmonic function is related backwards.
It should be used for deflections.
Example usage: "*isRelatedBackwards*".

Full examples of harmonic functions:
* D{extra: 7 / delay: 6-5, 4-3 / position: 7 / revolution: 1} - means
dominant with extra 7 in soprano voice, in bass should be 1, 
also specified special delays.
* So{down / revolution: 3>} - means minor subdominant, down, with 3> in bass
(= Neapolitan chord).
* D{extra: 9 / omit: 5} - means dominant with extra 9 without usage of 5. 

Full example of measure: T{}; S{}; So{extra:6}; D{extra: 7, omit: 5}; T{delay: 4-3}

Plugin supports modulation deflections. To specify deflection you have to wrap harmonic functions between parentheses.
Examples: 
* (S{}; D{}); D{}; T{} - means that we have modulation deflection to dominant.
* (S{}; D{})[T{degree:6}];D{};T{} - first part is elipse. Between parentheses () there is deflection to elipse source chord
which should be wrapped between [].
* S{}; (S{isRelatedBackwards}); D{}; T{} - means that second harmonic function is deflected backwards to first harmonic function.

Plugin supports Chopin chord and Neapolitan chord.
When you specify harmonic function with more than four chord components,
plugin will choose the ones to omit.
When you add ninth to extra, plugin adds seventh to extra.
It also corrects mistakes made by user - for example from T{position: 3>} it will make T{position: 3}.

There are also some example files in folder /examples/harmonics.
You can import them and learn notation from examples.

#### Exercises with given figured bass
To solve this type of exercises open a tab called "Bass".

There is only one button Solve for solving exercise.
Before you will click Solve, you should open score containing 
bass voice with figured bass symbols. If you want to bind note with
specific symbol - choose note and use shortcut *ctrl+G*.

There are also some example scores in folder /examples/bass.

#### Exercises with given soprano melody
To solve this type of exercises open a tab called "Soprano".
