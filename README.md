# Introduction
Explorer is a minimal wrapper over the NodeJs' `fs` module that uses promise to interact with files and directories.

# Install

1. Clone this repository
    ```
    git clone git@github.com:mrishab/Explorer.git
    ```

2. Go to the project's root directory and install dependencies.
    ```
    npm install
    ```

3. Create a TAR file locally.
    ```
    npm pack
    ```

4. Now you can install this project in a different project using the relative file path.
    ```
    npm install -f /path/to/this/project/root/directory/explorer-<version>.tgz
    ```
