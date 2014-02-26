
interface IResultSegment {
	expected: string;
	actual: string;
	diff: string;
	diffValue: string;
	pass: boolean;
}

export = IResultSegment;