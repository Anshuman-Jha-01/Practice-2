try {
    throw new Error("Custom Error");
} catch (error) {
    console.log(error.message);
}

