interface IdGenerator {
    generate(): Promise<string>;
}

export default IdGenerator;
