import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
	Book,
	Bot,
	Code2,
	LifeBuoy,
	Settings2,
	SquareTerminal,
	SquareUser,
	Triangle,
} from "lucide-react";
import * as OTPAuth from "otpauth";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Link, useSearchParams } from "react-router-dom";
import { ModeToggle } from "./components/theme/mode-toggle";
import { cn } from "./lib/utils";
import { useEffect } from "react";
import { toast } from "./hooks/use-toast";
import { Textarea } from "./components/ui/textarea";

export const description =
	"An AI playground with a sidebar navigation and a main content area. The playground has a header with a settings drawer and a share button. The sidebar has navigation links and a user menu. The main content area shows a form to configure the model and messages.";

type HashingAlgorithm =
	| "SHA1"
	| "SHA224"
	| "SHA256"
	| "SHA384"
	| "SHA512"
	| "SHA3-224"
	| "SHA3-256"
	| "SHA3-384"
	| "SHA3-512";

function AlgorithmInput({
	onChange,
	value,
}: {
	onChange: (v: HashingAlgorithm) => void;
	value: HashingAlgorithm;
}) {
	return (
		<div className="grid gap-3">
			<Label htmlFor="color-space">Hashing Algorithm</Label>
			<Select
				onValueChange={(v) => onChange(v as HashingAlgorithm)}
				value={value}
			>
				<SelectTrigger id="color-space" aria-label={value}>
					<SelectValue placeholder="Select a color space" />
				</SelectTrigger>
				<SelectContent>
					{(
						[
							"SHA1",
							"SHA224",
							"SHA256",
							"SHA384",
							"SHA512",
							"SHA3-224",
							"SHA3-256",
							"SHA3-384",
							"SHA3-512",
						] as HashingAlgorithm[]
					).map((val) => (
						<SelectItem key={val} value={val}>
							{val}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

type SearchParamsObj = {
	issuer?: string;
	label?: string;
	hashing_algorithm?: HashingAlgorithm;
	digits?: string;
	period?: string;
	secret?: string;
};

export function Dashboard() {
	const [searchParams, setSearchParams] = useSearchParams();

	const searchParamsObj: SearchParamsObj = Object.fromEntries(
		searchParams.entries()
	);
	console.log(searchParamsObj);

	useEffect(() => {
		const defaultParams = {
			issuer: "ACME",
			label: "Alice",
			hashing_algorithm: "SHA1",
			digits: "6",
			period: "30",
			secret: new OTPAuth.Secret().base32,
		};

		const updatedParams = { ...defaultParams, ...searchParamsObj };

		// Object.keys(defaultParams).forEach((key) => {
		// 	if (!searchParams.has(key)) {
		// 		searchParams.set(key, defaultParams[key]);
		// 	}
		// });

		setSearchParams(updatedParams);

		return () => {
			// Cleanup if necessary
		};
	}, []);

	const totpGenerator = new OTPAuth.TOTP({
		// Provider or service the account is associated with.
		issuer: searchParamsObj.issuer,
		// Account identifier.
		label: searchParamsObj.label,
		// Algorithm used for the HMAC function, possible values are:
		//   "SHA1", "SHA224", "SHA256", "SHA384", "SHA512",
		//   "SHA3-224", "SHA3-256", "SHA3-384" and "SHA3-512".
		algorithm: searchParamsObj.hashing_algorithm,
		// Length of the generated tokens.
		digits: parseInt(searchParamsObj.digits ?? ""),
		// Interval of time for which a token is valid, in seconds.
		period: parseInt(searchParamsObj.period ?? ""),
		// Arbitrary key encoded in base32 or `OTPAuth.Secret` instance
		// (if omitted, a cryptographically secure random secret is generated).
		secret: searchParamsObj.secret,
		//   or: `OTPAuth.Secret.fromBase32("US3WHSG7X5KAPV27VANWKQHF3SH3HULL")`
		//   or: `new OTPAuth.Secret()`
	});

	// Generate a token (returns the current token as a string).
	const generatedCode = totpGenerator.generate();
	const generatedCodeUri = totpGenerator.toString();

	const onAlgorithmChange = (value: HashingAlgorithm) => {
		setSearchParams((prev) => {
			return {
				...Object.fromEntries(prev.entries()),
				hashing_algorithm: value,
			};
		});
	};

	return (
		<div className="mx-auto container max-w-6xl grid h-screen w-full xpl-[53px]">
			{/* <Aside /> */}
			<div className="flex flex-col">
				<header className="sticky top-0 z-10 flex py-2 items-center gap-1 border-b bg-background px-4 flex-wrap justify-between">
					<div>
						<h1 className="text-xl font-semibold">TOTP Token Generator</h1>
					</div>
					<div className="flex items-center flex-wrap gap-1">
						<Button asChild variant="ghost" size={"icon"} color="primary">
							<a
								href={"https://github.com/hichemfantar/totp-generator"}
								target="_blank"
								aria-label="Star me on github"
							>
								<GitHubLogoIcon className={cn("w-5 h-5")} />
							</a>
						</Button>
						<ModeToggle />
					</div>
				</header>
				<main className="grid md:flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="xhidden flex-col items-start gap-8 md:flex lg:col-span-2">
						<form className="grid w-full items-start gap-6">
							<fieldset className="grid gap-4 rounded-lg border p-4">
								<legend className="-ml-1 px-1 text-sm font-medium">
									Parameters
								</legend>
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="issuer">Issuer</Label>
									<Input
										placeholder="Provider or service the account is associated with"
										value={searchParamsObj["issuer"] ?? undefined}
										type="text"
										id="issuer"
										onChange={(e) => {
											console.log(e.target.value);
											setSearchParams((prev) => {
												return {
													...Object.fromEntries(prev.entries()),
													issuer: e.target.value,
												};
											});
										}}
									/>
								</div>
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="label">Label</Label>
									<Input
										placeholder="Account identifier"
										value={searchParamsObj["label"] ?? undefined}
										type="text"
										id="label"
										onChange={(e) => {
											console.log(e.target.value);
											setSearchParams((prev) => {
												return {
													...Object.fromEntries(prev.entries()),
													label: e.target.value,
												};
											});
										}}
									/>
								</div>
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="secret_key">Your Secret Key</Label>
									<Input
										value={searchParamsObj["secret"] ?? undefined}
										type="text"
										id="secret_key"
										onChange={(e) => {
											console.log(e.target.value);
											setSearchParams((prev) => {
												return {
													...Object.fromEntries(prev.entries()),
													secret: e.target.value,
												};
											});
										}}
									/>
								</div>
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="number_digits">Number of Digits</Label>
									<Input
										value={searchParamsObj["digits"] ?? undefined}
										type="number"
										min={1}
										id="number_digits"
										onChange={(e) => {
											console.log(e.target.value);
											setSearchParams((prev) => {
												return {
													...Object.fromEntries(prev.entries()),
													digits: e.target.value,
												};
											});
										}}
									/>
								</div>
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="period">Token Period (seconds)</Label>
									<Input
										value={searchParamsObj["period"] ?? undefined}
										type="number"
										min={1}
										id="period"
										onChange={(e) => {
											console.log(e.target.value);
											setSearchParams((prev) => {
												return {
													...Object.fromEntries(prev.entries()),
													period: e.target.value,
												};
											});
										}}
									/>
								</div>

								<AlgorithmInput
									value={
										(searchParamsObj[
											"hashing_algorithm"
										] as HashingAlgorithm) ?? "SHA1"
									}
									onChange={onAlgorithmChange}
								/>
							</fieldset>
						</form>
					</div>

					<div className="lg:col-span-2">
						<div className="relative flex xh-full xxmd:min-h-[50vh] flex-col rounded-xl xbg-muted/50 p-4 gap-4">
							<div className="mx-auto bg-white p-4 rounded-xl invert dark:invert-0 aspect-square flex justify-center items-center">
								<QRCodeSVG
									size={200}
									// className="h-96"
									value={generatedCodeUri}
									title="Code"
								/>
							</div>

							<div className="space-y-3">
								<div className="grid w-full items-center gap-1.5">
									<Label htmlFor="generated_url">URL</Label>
									<Textarea
										id="generated_url"
										value={generatedCodeUri}
										readOnly
										rows={3}
									/>
								</div>

								<Button
									variant="default"
									size="lg"
									className="w-full"
									onClick={() => {
										navigator.clipboard.writeText(generatedCodeUri);
										toast({
											title: "URL Copied to Clipboard",
											description: generatedCodeUri,
											duration: 10000,
										});
									}}
								>
									Copy URL
								</Button>
								<Button variant="default" size="lg" className="w-full" asChild>
									<Link target="_blank" to={generatedCodeUri}>
										Open URL
									</Link>
								</Button>
							</div>

							<div className="text-7xl mx-auto">{generatedCode}</div>
							<div>
								<Button
									variant="default"
									size="lg"
									className="w-full"
									onClick={() => {
										navigator.clipboard.writeText(generatedCode);
										toast({
											title: "Code Copied to Clipboard",
											description: generatedCode,
											duration: 10000,
										});
									}}
								>
									Copy Code
								</Button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

function Aside() {
	return (
		<aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
			<div className="border-b p-2">
				<Button variant="outline" size="icon" aria-label="Home">
					<Triangle className="size-5 fill-foreground" />
				</Button>
			</div>
			<nav className="grid gap-1 p-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg bg-muted"
							aria-label="Playground"
						>
							<SquareTerminal className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Playground
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Models"
						>
							<Bot className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Models
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="API"
						>
							<Code2 className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						API
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Documentation"
						>
							<Book className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Documentation
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg"
							aria-label="Settings"
						>
							<Settings2 className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Settings
					</TooltipContent>
				</Tooltip>
			</nav>
			<nav className="mt-auto grid gap-1 p-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg"
							aria-label="Help"
						>
							<LifeBuoy className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Help
					</TooltipContent>
				</Tooltip>
				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							variant="ghost"
							size="icon"
							className="mt-auto rounded-lg"
							aria-label="Account"
						>
							<SquareUser className="size-5" />
						</Button>
					</TooltipTrigger>
					<TooltipContent side="right" sideOffset={5}>
						Account
					</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	);
}
