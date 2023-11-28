#!/bin/bash

# Run the command and save the output into a variable
modules=$(monkeytype list-modules)

# Iterate over each line (module) in the output
for module in $modules
do
    # Apply monkeytype to the module
    monkeytype apply $module
done
