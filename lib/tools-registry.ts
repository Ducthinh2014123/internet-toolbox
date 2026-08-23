import {
  Braces, FileJson, FileCode2, FileType, Regex, GitCompare, FileText as FileTextIcon,
  Binary, KeyRound, Fingerprint, Hash, Shuffle, ShieldCheck, Link2, Code,
  Type, CaseSensitive, ListOrdered, Rows3, Eraser, SplitSquareHorizontal,
  Repeat, FlipHorizontal, AtSign, Link as LinkIcon, ListFilter, WrapText,
  Clock, CalendarClock, CalendarDays, Timer, Globe2, CalendarCheck2, CalendarRange,
  Cake, Briefcase, CalendarSearch, CalendarPlus, CalendarX2, Terminal, History, Watch,
  Globe, SlidersHorizontal, Settings2, FileSearch, FileDigit, MonitorSmartphone,
  ScrollText, FileOutput, FileInput, Compass, Search, Boxes, Cpu,
  Network, Router, Server, Route, Gauge, HardDrive, Lock, KeySquare, Container,
  ShieldAlert, Palette, Captions, Subtitles, Table2, FileSpreadsheet,
  Maximize2, Minimize2, FileImage, Crop, ImagePlus, Pipette, Layers, Sparkles,
  Grid3x3, QrCode, Wifi, Contact, Mail, MessageSquare, Phone, Barcode, LayoutGrid, Blend,
} from "lucide-react";
import type { ToolDefinition } from "./types";
import * as enc from "./tools/encoding";
import * as txt from "./tools/text";
import * as dt from "./tools/datetime";
import * as dev from "./tools/developer";
import * as web from "./tools/web";
import * as net from "./tools/network";
import * as gen from "./tools/generators";
import * as img from "./tools/image";
import * as qrb from "./tools/qrbarcode";
import * as sub from "./tools/subtitle";

export const tools: ToolDefinition[] = [
  // ---------------- Developer & Code (dependency-free subset) ----------------
  {
    id: "json-formatter", name: "JSON Formatter", description: "Format, minify and validate JSON",
    category: "developer", icon: Braces, keywords: ["json", "format", "formatter", "pretty", "validate"], popular: true,
    componentType: "text-io", placeholder: '{"name":"John","age":20}', sample: '{"name":"John","age":20,"active":true,"tags":["a","b"]}',
    downloadExt: "json", downloadMime: "application/json",
    modes: [
      { id: "format", label: "Format", run: dev.jsonFormat },
      { id: "minify", label: "Minify", run: dev.jsonMinify },
      { id: "validate", label: "Validate", run: dev.jsonValidate },
    ],
  },
  {
    id: "json-validator", name: "JSON Validator", description: "Check whether JSON is syntactically valid",
    category: "developer", icon: FileJson, keywords: ["json", "validate", "lint"],
    componentType: "text-io", placeholder: '{"valid": true}', sample: '{"valid": true}',
    modes: [{ id: "validate", label: "Validate", run: dev.jsonValidate }],
  },
  {
    id: "json-minifier", name: "JSON Minifier", description: "Remove whitespace from JSON",
    category: "developer", icon: FileJson, keywords: ["json", "minify", "compress"],
    componentType: "text-io", placeholder: '{"a": 1}', sample: '{\n  "a": 1\n}', downloadExt: "json", downloadMime: "application/json",
    modes: [{ id: "minify", label: "Minify", run: dev.jsonMinify }],
  },
  {
    id: "json-to-yaml", name: "JSON \u2192 YAML", description: "Convert JSON into YAML",
    category: "developer", icon: FileCode2, keywords: ["json", "yaml", "convert"],
    componentType: "text-io", placeholder: '{"a": 1}', sample: '{"name":"demo","list":[1,2,3]}', downloadExt: "yaml", downloadMime: "text/yaml",
    modes: [{ id: "convert", label: "Convert", run: dev.jsonToYaml }],
  },
  {
    id: "json-to-csv", name: "JSON \u2192 CSV", description: "Convert a JSON array of objects into CSV",
    category: "developer", icon: FileCode2, keywords: ["json", "csv", "convert"],
    componentType: "text-io", placeholder: '[{"a":1}]', sample: '[{"name":"John","age":20},{"name":"Anna","age":25}]', downloadExt: "csv", downloadMime: "text/csv",
    modes: [{ id: "convert", label: "Convert", run: dev.jsonToCsv }],
  },
  {
    id: "csv-formatter", name: "CSV Formatter", description: "Normalize and re-quote CSV content",
    category: "developer", icon: FileTextIcon, keywords: ["csv", "format"],
    componentType: "text-io", placeholder: "a,b\n1,2", sample: "name,age\nJohn,20\nAnna,25", downloadExt: "csv", downloadMime: "text/csv",
    modes: [{ id: "format", label: "Format", run: dev.csvFormat }],
  },
  {
    id: "csv-to-json", name: "CSV \u2192 JSON", description: "Convert CSV rows into a JSON array",
    category: "developer", icon: FileCode2, keywords: ["csv", "json", "convert"],
    componentType: "text-io", placeholder: "a,b\n1,2", sample: "name,age\nJohn,20\nAnna,25", downloadExt: "json", downloadMime: "application/json",
    modes: [{ id: "convert", label: "Convert", run: dev.csvToJson }],
  },
  {
    id: "tsv-to-csv", name: "TSV \u2192 CSV", description: "Convert tab-separated values into CSV",
    category: "developer", icon: FileCode2, keywords: ["tsv", "csv", "convert"],
    componentType: "text-io", placeholder: "a\tb", sample: "name\tage\nJohn\t20", downloadExt: "csv", downloadMime: "text/csv",
    modes: [{ id: "convert", label: "Convert", run: dev.tsvToCsv }],
  },
  {
    id: "xml-formatter", name: "XML Formatter", description: "Pretty-print XML documents",
    category: "developer", icon: Code, keywords: ["xml", "format", "pretty"],
    componentType: "text-io", placeholder: "<a><b>1</b></a>", sample: "<root><item>1</item><item>2</item></root>", downloadExt: "xml", downloadMime: "application/xml",
    modes: [{ id: "format", label: "Format", run: dev.xmlFormat }, { id: "validate", label: "Validate", run: dev.xmlValidate }],
  },
  {
    id: "xml-validator", name: "XML Validator", description: "Check whether XML is well-formed",
    category: "developer", icon: Code, keywords: ["xml", "validate"],
    componentType: "text-io", placeholder: "<a></a>", sample: "<root><item>1</item></root>",
    modes: [{ id: "validate", label: "Validate", run: dev.xmlValidate }],
  },
  {
    id: "html-formatter", name: "HTML Formatter", description: "Pretty-print HTML markup",
    category: "developer", icon: Code, keywords: ["html", "format", "pretty"],
    componentType: "text-io", placeholder: "<div><p>hi</p></div>", sample: "<div><p>Hello</p><p>World</p></div>", downloadExt: "html", downloadMime: "text/html",
    modes: [{ id: "format", label: "Format", run: dev.htmlFormat }, { id: "minify", label: "Minify", run: dev.simpleMinifyHtml }],
  },
  {
    id: "css-formatter", name: "CSS Formatter", description: "Minify CSS rules",
    category: "developer", icon: Code, keywords: ["css", "format", "minify"],
    componentType: "text-io", placeholder: "a{color:red}", sample: ".a {\n  color: red;\n}", downloadExt: "css", downloadMime: "text/css",
    modes: [{ id: "minify", label: "Minify", run: dev.simpleMinifyCss }],
  },
  {
    id: "regex-tester", name: "Regex Tester", description: "Test a regular expression against sample text",
    category: "developer", icon: Regex, keywords: ["regex", "regexp", "test", "pattern"], popular: true,
    componentType: "form",
    fields: [
      { type: "text", id: "pattern", label: "Pattern", placeholder: "\\d+", defaultValue: "\\d+" },
      { type: "text", id: "flags", label: "Flags", placeholder: "gi", defaultValue: "g" },
      { type: "textarea", id: "text", label: "Test text", rows: 6, defaultValue: "Order 12 has 3 items." },
    ],
    run: (v) => {
      try {
        return dev.regexTest(String(v.pattern), String(v.flags), String(v.text));
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Invalid pattern" };
      }
    },
  },
  {
    id: "code-diff", name: "Code Diff", description: "Compare two blocks of text line by line",
    category: "developer", icon: GitCompare, keywords: ["diff", "compare", "code"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "a", label: "Original", rows: 8, defaultValue: "line one\nline two" },
      { type: "textarea", id: "b", label: "Modified", rows: 8, defaultValue: "line one\nline TWO\nline three" },
    ],
    run: (v) => txt.diffLines(String(v.a), String(v.b)),
  },
  {
    id: "markdown-to-text", name: "Markdown Formatter", description: "Strip Markdown syntax down to plain text",
    category: "developer", icon: FileTextIcon, keywords: ["markdown", "md", "format", "plain text"],
    componentType: "text-io", placeholder: "# Title", sample: "# Title\n\nSome **bold** and _italic_ text with a [link](https://example.com).",
    modes: [{ id: "convert", label: "To plain text", run: dev.markdownToPlainText }],
  },

  // ---------------- Encoding & Crypto ----------------
  {
    id: "base64", name: "Base64 Encoder / Decoder", description: "Encode or decode Base64 with full Unicode support",
    category: "encoding", icon: Binary, keywords: ["base64", "encode", "decode"], popular: true,
    componentType: "text-io", placeholder: "Hello, world!", sample: "Xin ch\u00e0o, th\u1ebf gi\u1edbi!",
    modes: [{ id: "encode", label: "Encode", run: enc.base64Encode }, { id: "decode", label: "Decode", run: enc.base64Decode }],
  },
  {
    id: "url-encoder", name: "URL Encoder / Decoder", description: "Percent-encode or decode URL components",
    category: "encoding", icon: Link2, keywords: ["url", "encode", "decode", "percent"],
    componentType: "text-io", placeholder: "a b/c", sample: "https://example.com/search?q=h\u1ec7 \u0111i\u1ec1u h\u01b0\u1edbng",
    modes: [{ id: "encode", label: "Encode", run: enc.urlEncode }, { id: "decode", label: "Decode", run: enc.urlDecode }],
  },
  {
    id: "html-entity", name: "HTML Entity Encoder / Decoder", description: "Convert special characters to/from HTML entities",
    category: "encoding", icon: Code, keywords: ["html", "entity", "encode", "decode"],
    componentType: "text-io", placeholder: "<div>", sample: '<a href="x">Tom & Jerry</a>',
    modes: [{ id: "encode", label: "Encode", run: enc.htmlEntityEncode }, { id: "decode", label: "Decode", run: enc.htmlEntityDecode }],
  },
  {
    id: "jwt-decoder", name: "JWT Decoder", description: "Decode a JSON Web Token header and payload",
    category: "encoding", icon: ShieldCheck, keywords: ["jwt", "token", "decode", "json web token"], popular: true,
    componentType: "text-io", placeholder: "eyJhbGciOi...",
    sample: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    modes: [{ id: "decode", label: "Decode", run: enc.decodeJwt }],
  },
  {
    id: "uuid-generator", name: "UUID Generator", description: "Generate random UUID v4 values",
    category: "encoding", icon: Fingerprint, keywords: ["uuid", "guid", "generator", "random"], popular: true,
    componentType: "form",
    fields: [{ type: "number", id: "count", label: "How many", defaultValue: 5, min: 1, max: 100 }],
    run: (v) => Array.from({ length: Math.max(1, Math.min(Number(v.count) || 1, 100)) }, () => enc.generateUuidV4()).join("\n"),
  },
  {
    id: "sha256-generator", name: "SHA-256 Generator", description: "Compute the SHA-256 hash of text using Web Crypto",
    category: "encoding", icon: Hash, keywords: ["sha256", "hash", "sha-256"], popular: true,
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "hash", label: "Generate SHA-256", run: (input) => enc.sha(input, "SHA-256") }],
  },
  {
    id: "sha384-generator", name: "SHA-384 Generator", description: "Compute the SHA-384 hash of text using Web Crypto",
    category: "encoding", icon: Hash, keywords: ["sha384", "hash", "sha-384"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "hash", label: "Generate SHA-384", run: (input) => enc.sha(input, "SHA-384") }],
  },
  {
    id: "sha512-generator", name: "SHA-512 Generator", description: "Compute the SHA-512 hash of text using Web Crypto",
    category: "encoding", icon: Hash, keywords: ["sha512", "hash", "sha-512"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "hash", label: "Generate SHA-512", run: (input) => enc.sha(input, "SHA-512") }],
  },
  {
    id: "sha1-generator", name: "SHA-1 Generator", description: "Compute the SHA-1 hash of text using Web Crypto",
    category: "encoding", icon: Hash, keywords: ["sha1", "hash", "sha-1"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "hash", label: "Generate SHA-1", run: (input) => enc.sha(input, "SHA-1") }],
  },
  {
    id: "md5-generator", name: "MD5 Generator", description: "Compute the MD5 hash of text",
    category: "encoding", icon: Hash, keywords: ["md5", "hash"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "hash", label: "Generate MD5", run: enc.md5 }],
  },
  {
    id: "hmac-generator", name: "HMAC Generator", description: "Compute an HMAC-SHA256 signature for a message and secret key",
    category: "encoding", icon: ShieldCheck, keywords: ["hmac", "sha256", "signature", "secret"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "message", label: "Message", rows: 4, defaultValue: "Hello, world!" },
      { type: "text", id: "secret", label: "Secret key", defaultValue: "my-secret-key" },
    ],
    run: (v) => enc.hmacSha256(String(v.message), String(v.secret)),
  },
  {
    id: "random-token", name: "Random Token Generator", description: "Generate a cryptographically secure hex token",
    category: "encoding", icon: KeyRound, keywords: ["token", "random", "secret", "secure"],
    componentType: "form",
    fields: [{ type: "number", id: "length", label: "Length (bytes)", defaultValue: 32, min: 8, max: 256 }],
    run: (v) => enc.randomToken(Number(v.length) || 32),
  },
  {
    id: "random-string", name: "Random String Generator", description: "Generate a random string from a chosen character set",
    category: "encoding", icon: Shuffle, keywords: ["random", "string", "generator"],
    componentType: "form",
    fields: [
      { type: "number", id: "length", label: "Length", defaultValue: 24, min: 1, max: 512 },
      { type: "select", id: "charset", label: "Character set", defaultValue: "alnum", options: [
        { label: "Letters + numbers", value: "alnum" }, { label: "Letters only", value: "alpha" },
        { label: "Numbers only", value: "numeric" }, { label: "Hex", value: "hex" },
      ] },
    ],
    run: (v) => enc.randomString(Number(v.length) || 24, String(v.charset)),
  },
  {
    id: "checksum-crc32", name: "Checksum Calculator (CRC32)", description: "Calculate the CRC32 checksum of text",
    category: "encoding", icon: Hash, keywords: ["checksum", "crc32", "hash"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "calc", label: "Calculate", run: enc.checksumCrc32 }],
  },
  {
    id: "hex-encoder", name: "Hex Encoder / Decoder", description: "Convert text to and from hexadecimal",
    category: "encoding", icon: Binary, keywords: ["hex", "hexadecimal", "encode", "decode"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello",
    modes: [{ id: "encode", label: "Encode", run: enc.hexEncode }, { id: "decode", label: "Decode", run: enc.hexDecode }],
  },
  {
    id: "binary-encoder", name: "Binary Encoder / Decoder", description: "Convert text to and from binary (base 2)",
    category: "encoding", icon: Binary, keywords: ["binary", "encode", "decode"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello",
    modes: [{ id: "encode", label: "Encode", run: enc.binaryEncode }, { id: "decode", label: "Decode", run: enc.binaryDecode }],
  },
  {
    id: "base32-encoder", name: "Base32 Encoder / Decoder", description: "Convert text to and from Base32 (RFC 4648)",
    category: "encoding", icon: Binary, keywords: ["base32", "encode", "decode", "rfc4648"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "encode", label: "Encode", run: enc.base32Encode }, { id: "decode", label: "Decode", run: enc.base32Decode }],
  },

  // ---------------- Text ----------------
  {
    id: "word-counter", name: "Word Counter", description: "Count words, characters, lines and sentences",
    category: "text", icon: Type, keywords: ["word", "count", "counter"], popular: true,
    componentType: "text-io", placeholder: "Type or paste text...", sample: "The quick brown fox jumps over the lazy dog.",
    modes: [
      { id: "words", label: "Word count", run: txt.wordCount },
      { id: "chars", label: "Character count", run: txt.charCount },
      { id: "lines", label: "Line count", run: txt.lineCount },
      { id: "sentences", label: "Sentence count", run: txt.sentenceCount },
    ],
  },
  {
    id: "case-converter", name: "Case Converter", description: "Convert text between letter cases",
    category: "text", icon: CaseSensitive, keywords: ["case", "upper", "lower", "camel", "snake", "kebab"], popular: true,
    componentType: "text-io", placeholder: "hello world", sample: "hello world example",
    modes: [
      { id: "upper", label: "UPPERCASE", run: txt.toUpperCase },
      { id: "lower", label: "lowercase", run: txt.toLowerCase },
      { id: "title", label: "Title Case", run: txt.toTitleCase },
      { id: "sentence", label: "Sentence case", run: txt.toSentenceCase },
      { id: "camel", label: "camelCase", run: txt.toCamelCase },
      { id: "snake", label: "snake_case", run: txt.toSnakeCase },
      { id: "kebab", label: "kebab-case", run: txt.toKebabCase },
    ],
  },
  {
    id: "remove-duplicate-lines", name: "Remove Duplicate Lines", description: "Remove repeated lines from a list",
    category: "text", icon: Rows3, keywords: ["duplicate", "lines", "unique"],
    componentType: "text-io", placeholder: "a\na\nb", sample: "apple\nbanana\napple\ncherry",
    modes: [{ id: "dedupe", label: "Remove duplicates", run: txt.removeDuplicateLines }],
  },
  {
    id: "sort-lines", name: "Sort Lines", description: "Sort lines alphabetically ascending or descending",
    category: "text", icon: ListOrdered, keywords: ["sort", "lines", "alphabetical"],
    componentType: "text-io", placeholder: "b\na\nc", sample: "banana\napple\ncherry",
    modes: [{ id: "asc", label: "Sort A\u2192Z", run: txt.sortLinesAsc }, { id: "desc", label: "Sort Z\u2192A", run: txt.sortLinesDesc }],
  },
  {
    id: "reverse-lines", name: "Reverse Lines", description: "Reverse the order of lines",
    category: "text", icon: FlipHorizontal, keywords: ["reverse", "lines"],
    componentType: "text-io", placeholder: "a\nb\nc", sample: "first\nsecond\nthird",
    modes: [{ id: "reverse", label: "Reverse", run: txt.reverseLines }],
  },
  {
    id: "remove-empty-lines", name: "Remove Empty Lines", description: "Strip blank lines from text",
    category: "text", icon: Eraser, keywords: ["empty", "blank", "lines", "remove"],
    componentType: "text-io", placeholder: "a\n\nb", sample: "line one\n\nline two\n\n\nline three",
    modes: [{ id: "remove", label: "Remove empty lines", run: txt.removeEmptyLines }],
  },
  {
    id: "remove-extra-spaces", name: "Remove Extra Spaces", description: "Collapse repeated spaces and trim lines",
    category: "text", icon: SplitSquareHorizontal, keywords: ["spaces", "whitespace", "trim"],
    componentType: "text-io", placeholder: "a    b", sample: "This   has    extra   spaces.",
    modes: [{ id: "clean", label: "Clean spaces", run: txt.removeExtraSpaces }],
  },
  {
    id: "find-replace", name: "Find & Replace", description: "Find and replace text, with optional regex",
    category: "text", icon: WrapText, keywords: ["find", "replace", "search"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "text", label: "Text", rows: 6, defaultValue: "the cat sat on the mat" },
      { type: "text", id: "find", label: "Find", defaultValue: "cat" },
      { type: "text", id: "replace", label: "Replace with", defaultValue: "dog" },
      { type: "checkbox", id: "regex", label: "Use regular expression", defaultValue: false },
    ],
    run: (v) => {
      try {
        return txt.findAndReplace(String(v.text), String(v.find), String(v.replace), Boolean(v.regex));
      } catch (e) {
        return { error: e instanceof Error ? e.message : "Invalid pattern" };
      }
    },
  },
  {
    id: "text-diff", name: "Text Diff", description: "Compare two pieces of text line by line",
    category: "text", icon: GitCompare, keywords: ["diff", "compare", "text"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "a", label: "Text A", rows: 8, defaultValue: "Hello world" },
      { type: "textarea", id: "b", label: "Text B", rows: 8, defaultValue: "Hello there world" },
    ],
    run: (v) => txt.diffLines(String(v.a), String(v.b)),
  },
  {
    id: "readability-score", name: "Text Readability Score", description: "Estimate Flesch Reading Ease and Flesch-Kincaid grade level",
    category: "text", icon: ScrollText, keywords: ["readability", "flesch", "grade level", "reading ease"],
    componentType: "text-io", placeholder: "Paste a paragraph...", sample: "The quick brown fox jumps over the lazy dog. This sentence is often used to test typefaces and keyboards.",
    modes: [{ id: "analyze", label: "Analyze", run: txt.readabilityScore }],
  },
  {
    id: "slug-generator", name: "Slug Generator", description: "Turn text into a URL-friendly slug",
    category: "text", icon: LinkIcon, keywords: ["slug", "url", "seo"], popular: true,
    componentType: "text-io", placeholder: "Hello World!", sample: "10 Best Tools for Developers in 2026!",
    modes: [{ id: "slugify", label: "Slugify", run: txt.slugify }],
  },
  {
    id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs",
    category: "text", icon: FileTextIcon, keywords: ["lorem", "ipsum", "placeholder", "dummy text"],
    componentType: "form",
    fields: [{ type: "number", id: "paragraphs", label: "Paragraphs", defaultValue: 3, min: 1, max: 20 }],
    run: (v) => txt.loremIpsum(Number(v.paragraphs) || 3),
  },
  {
    id: "text-repeater", name: "Text Repeater", description: "Repeat a line of text a number of times",
    category: "text", icon: Repeat, keywords: ["repeat", "duplicate", "text"],
    componentType: "form",
    fields: [
      { type: "text", id: "text", label: "Text", defaultValue: "Hello" },
      { type: "number", id: "times", label: "Times", defaultValue: 5, min: 1, max: 10000 },
    ],
    run: (v) => txt.repeatText(String(v.text), Number(v.times) || 1),
  },
  {
    id: "text-reverser", name: "Text Reverser", description: "Reverse the characters in text",
    category: "text", icon: FlipHorizontal, keywords: ["reverse", "text", "backwards"],
    componentType: "text-io", placeholder: "Hello", sample: "Hello, world!",
    modes: [{ id: "reverse", label: "Reverse", run: txt.reverseText }],
  },
  {
    id: "extract-emails", name: "Extract Emails", description: "Find every email address in a block of text",
    category: "text", icon: AtSign, keywords: ["email", "extract", "find"],
    componentType: "text-io", placeholder: "contact: a@b.com", sample: "Contact john@example.com or support@example.org for help.",
    modes: [{ id: "extract", label: "Extract", run: txt.extractEmails }],
  },
  {
    id: "extract-urls", name: "Extract URLs", description: "Find every URL in a block of text",
    category: "text", icon: LinkIcon, keywords: ["url", "extract", "find", "link"],
    componentType: "text-io", placeholder: "visit https://a.com", sample: "Visit https://example.com or http://test.org/page for details.",
    modes: [{ id: "extract", label: "Extract", run: txt.extractUrls }],
  },
  {
    id: "extract-numbers", name: "Extract Numbers", description: "Find every number in a block of text",
    category: "text", icon: ListFilter, keywords: ["numbers", "extract", "find"],
    componentType: "text-io", placeholder: "item 1 costs 20.5", sample: "I have 3 apples, 12 oranges and paid 20.5 dollars.",
    modes: [{ id: "extract", label: "Extract", run: txt.extractNumbers }],
  },
  {
    id: "line-number-generator", name: "Line Number Generator", description: "Add line numbers to each line of text",
    category: "text", icon: ListOrdered, keywords: ["line", "number", "generator"],
    componentType: "text-io", placeholder: "a\nb\nc", sample: "first line\nsecond line\nthird line",
    modes: [{ id: "number", label: "Add line numbers", run: txt.addLineNumbers }],
  },

  // ---------------- Date & Time ----------------
  {
    id: "unix-timestamp", name: "Unix Timestamp Converter", description: "Convert a Unix timestamp to a readable date",
    category: "datetime", icon: Clock, keywords: ["unix", "timestamp", "epoch", "convert"], popular: true,
    componentType: "form",
    fields: [{ type: "text", id: "ts", label: "Unix timestamp", defaultValue: "1700000000" }],
    run: (v) => { try { return dt.unixToDate(String(v.ts)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "date-to-timestamp", name: "Date \u2192 Timestamp", description: "Convert a date/time into a Unix timestamp",
    category: "datetime", icon: CalendarClock, keywords: ["date", "timestamp", "convert"],
    componentType: "form",
    fields: [{ type: "datetime", id: "date", label: "Date & time", defaultValue: "2026-01-01T00:00" }],
    run: (v) => { try { return dt.dateToUnix(String(v.date)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "ms-converter", name: "Milliseconds Converter", description: "Convert milliseconds into seconds, minutes, hours and days",
    category: "datetime", icon: Timer, keywords: ["milliseconds", "convert", "duration"],
    componentType: "form",
    fields: [{ type: "text", id: "ms", label: "Milliseconds", defaultValue: "90061000" }],
    run: (v) => { try { return dt.msToUnits(String(v.ms)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "timezone-converter", name: "Timezone Converter", description: "Convert a date/time into another IANA time zone",
    category: "datetime", icon: Globe2, keywords: ["timezone", "tz", "convert"], popular: true,
    componentType: "form",
    fields: [
      { type: "datetime", id: "date", label: "Date & time", defaultValue: "2026-01-01T12:00" },
      { type: "text", id: "tz", label: "Target time zone (IANA)", defaultValue: "Asia/Tokyo" },
    ],
    run: (v) => { try { return dt.convertTimezone(String(v.date), String(v.tz)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "iso8601-converter", name: "ISO 8601 Converter", description: "Convert a date/time into ISO 8601 format",
    category: "datetime", icon: CalendarCheck2, keywords: ["iso", "8601", "convert", "date"],
    componentType: "form",
    fields: [{ type: "datetime", id: "date", label: "Date & time", defaultValue: "2026-01-01T12:00" }],
    run: (v) => { try { return dt.toIso8601(String(v.date)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "date-difference", name: "Date Difference Calculator", description: "Calculate the duration between two dates",
    category: "datetime", icon: CalendarRange, keywords: ["date", "difference", "duration", "between"], popular: true,
    componentType: "form",
    fields: [
      { type: "date", id: "start", label: "Start date", defaultValue: "2026-01-01" },
      { type: "date", id: "end", label: "End date", defaultValue: "2026-08-23" },
    ],
    run: (v) => { try { return dt.dateDifference(String(v.start), String(v.end)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "age-calculator", name: "Age Calculator", description: "Calculate exact age from a birth date",
    category: "datetime", icon: Cake, keywords: ["age", "birthday", "calculator"], popular: true,
    componentType: "form",
    fields: [{ type: "date", id: "birth", label: "Birth date", defaultValue: "2000-01-01" }],
    run: (v) => { try { return dt.ageCalculator(String(v.birth)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "working-days", name: "Working Days Calculator", description: "Count weekdays between two dates",
    category: "datetime", icon: Briefcase, keywords: ["working days", "weekdays", "business days"],
    componentType: "form",
    fields: [
      { type: "date", id: "start", label: "Start date", defaultValue: "2026-01-01" },
      { type: "date", id: "end", label: "End date", defaultValue: "2026-01-31" },
    ],
    run: (v) => { try { return dt.workingDaysBetween(String(v.start), String(v.end)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "week-number", name: "Week Number Calculator", description: "Find the ISO week number for a date",
    category: "datetime", icon: CalendarSearch, keywords: ["week", "number", "iso"],
    componentType: "form",
    fields: [{ type: "date", id: "date", label: "Date", defaultValue: "2026-01-01" }],
    run: (v) => { try { return dt.weekNumber(String(v.date)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "days-in-month", name: "Days in Month", description: "Find how many days are in a given month",
    category: "datetime", icon: CalendarDays, keywords: ["days", "month", "calendar"],
    componentType: "form",
    fields: [{ type: "text", id: "month", label: "Month (YYYY-MM)", defaultValue: "2026-02" }],
    run: (v) => { try { return dt.daysInMonth(String(v.month)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "leap-year", name: "Leap Year Checker", description: "Check whether a year is a leap year",
    category: "datetime", icon: CalendarPlus, keywords: ["leap year", "calendar"],
    componentType: "form",
    fields: [{ type: "number", id: "year", label: "Year", defaultValue: 2026 }],
    run: (v) => { try { return dt.leapYearCheck(String(v.year)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "quarter-calculator", name: "Fiscal Quarter Calculator", description: "Find the calendar quarter, start and end dates for any date",
    category: "datetime", icon: CalendarRange, keywords: ["quarter", "fiscal", "q1", "q2", "q3", "q4"],
    componentType: "form",
    fields: [{ type: "date", id: "date", label: "Date", defaultValue: "" }],
    run: (v) => { try { return dt.quarterInfo(String(v.date || "")); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "cron-helper", name: "Cron Expression Helper", description: "Explain a 5-field cron expression in plain English",
    category: "datetime", icon: Terminal, keywords: ["cron", "expression", "schedule"],
    componentType: "form",
    fields: [{ type: "text", id: "expr", label: "Cron expression", defaultValue: "*/15 * * * *" }],
    run: (v) => { try { return dt.explainCron(String(v.expr)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "relative-time", name: "Relative Time Generator", description: "Show a date as relative time (e.g. \"in 3 days\")",
    category: "datetime", icon: History, keywords: ["relative", "time", "ago", "from now"],
    componentType: "form",
    fields: [{ type: "datetime", id: "date", label: "Date & time", defaultValue: "2026-12-31T00:00" }],
    run: (v) => { try { return dt.relativeTime(String(v.date)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "current-time", name: "Current Time Generator", description: "Show the current time in multiple formats",
    category: "datetime", icon: Watch, keywords: ["current", "time", "now"],
    componentType: "form", fields: [], run: () => dt.currentTimeSnapshot(),
  },

  // ---------------- Developer & Code (additional formatters) ----------------
  {
    id: "sql-formatter", name: "SQL Formatter", description: "Format SQL queries with clause line breaks",
    category: "developer", icon: FileCode2, keywords: ["sql", "format", "query"],
    componentType: "text-io", placeholder: "select * from users where id=1", sample: "select id, name from users where age > 18 and active = true order by name",
    modes: [{ id: "format", label: "Format", run: dev.sqlFormat }],
  },
  {
    id: "toml-formatter", name: "TOML Formatter", description: "Normalize spacing in TOML configuration",
    category: "developer", icon: FileCode2, keywords: ["toml", "format", "config"],
    componentType: "text-io", placeholder: "name=\"demo\"", sample: "[package]\nname=\"demo\"\nversion=\"1.0.0\"",
    modes: [{ id: "format", label: "Format", run: dev.tomlFormat }],
  },
  {
    id: "graphql-formatter", name: "GraphQL Formatter", description: "Pretty-print GraphQL queries",
    category: "developer", icon: FileCode2, keywords: ["graphql", "format", "query"],
    componentType: "text-io", placeholder: "{ user { id name } }", sample: "query { user(id: 1) { id name friends { id name } } }",
    modes: [{ id: "format", label: "Format", run: dev.graphqlFormat }],
  },

  // ---------------- Web & URL ----------------
  {
    id: "url-parser", name: "URL Parser", description: "Break a URL into protocol, host, path and query parts",
    category: "web", icon: Globe, keywords: ["url", "parse", "parser"], popular: true,
    componentType: "text-io", placeholder: "https://example.com/path?a=1", sample: "https://example.com:8080/search?q=hello&page=2#top",
    modes: [{ id: "parse", label: "Parse", run: (i) => { try { return web.parseUrl(i); } catch (e) { throw new Error((e as Error).message || "Invalid URL"); } } }],
  },
  {
    id: "query-string-parser", name: "Query String Parser", description: "Parse a URL query string into JSON",
    category: "web", icon: SlidersHorizontal, keywords: ["query", "string", "parse", "params"],
    componentType: "text-io", placeholder: "?a=1&b=2", sample: "a=1&b=2&tag=x&tag=y",
    modes: [{ id: "parse", label: "Parse", run: web.parseQueryString }],
  },
  {
    id: "query-string-generator", name: "Query String Generator", description: "Build a URL query string from a JSON object",
    category: "web", icon: Settings2, keywords: ["query", "string", "generate", "params"],
    componentType: "text-io", placeholder: '{"a":1}', sample: '{"q":"hello","page":2,"tag":["a","b"]}',
    modes: [{ id: "generate", label: "Generate", run: web.generateQueryString }],
  },
  {
    id: "url-cleaner", name: "URL Cleaner", description: "Remove tracking parameters (utm_*, fbclid, gclid...) from a URL",
    category: "web", icon: Eraser, keywords: ["url", "clean", "tracking", "utm"], popular: true,
    componentType: "text-io", placeholder: "https://example.com?utm_source=x", sample: "https://example.com/page?utm_source=fb&utm_medium=cpc&id=123&fbclid=abc",
    modes: [{ id: "clean", label: "Clean", run: (i) => { try { return web.cleanUrl(i); } catch (e) { throw new Error((e as Error).message || "Invalid URL"); } } }],
  },
  {
    id: "http-status-lookup", name: "HTTP Status Code Lookup", description: "Look up the meaning of an HTTP status code",
    category: "web", icon: FileSearch, keywords: ["http", "status", "code", "lookup"],
    componentType: "form",
    fields: [{ type: "text", id: "code", label: "Status code", defaultValue: "404" }],
    run: (v) => { try { return web.lookupStatusCode(String(v.code)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "mime-type-lookup", name: "MIME Type Lookup", description: "Look up the MIME type for a file extension",
    category: "web", icon: FileDigit, keywords: ["mime", "type", "extension", "lookup"],
    componentType: "form",
    fields: [{ type: "text", id: "ext", label: "File extension", defaultValue: "json" }],
    run: (v) => { try { return web.lookupMimeType(String(v.ext)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "user-agent-parser", name: "User-Agent Parser", description: "Detect browser, OS and device type from a User-Agent string",
    category: "web", icon: MonitorSmartphone, keywords: ["user agent", "browser", "os", "parse"],
    componentType: "text-io", placeholder: "Mozilla/5.0...",
    sample: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    modes: [{ id: "parse", label: "Parse", run: web.parseUserAgent }],
  },
  {
    id: "http-header-parser", name: "HTTP Header Viewer", description: "Parse pasted raw HTTP headers into structured JSON",
    category: "web", icon: ScrollText, keywords: ["http", "header", "viewer", "parse"],
    componentType: "text-io", placeholder: "Content-Type: application/json",
    sample: "Content-Type: application/json\nCache-Control: no-cache\nX-Request-Id: abc123",
    modes: [{ id: "parse", label: "Parse", run: (i) => { try { return web.parseHttpHeaders(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "data-uri-generator", name: "Data URI Generator", description: "Convert text into a base64 data URI",
    category: "web", icon: FileOutput, keywords: ["data uri", "base64", "generate"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "text", label: "Text", rows: 5, defaultValue: "Hello, world!" },
      { type: "select", id: "mimeType", label: "MIME type", defaultValue: "text/plain", options: [
        { label: "text/plain", value: "text/plain" }, { label: "text/html", value: "text/html" },
        { label: "application/json", value: "application/json" }, { label: "image/svg+xml", value: "image/svg+xml" },
      ] },
    ],
    run: (v) => web.generateDataUri(String(v.text), String(v.mimeType)),
  },
  {
    id: "data-uri-decoder", name: "Data URI Decoder", description: "Decode a data URI back into text",
    category: "web", icon: FileInput, keywords: ["data uri", "base64", "decode"],
    componentType: "text-io", placeholder: "data:text/plain;base64,SGVsbG8=", sample: "data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==",
    modes: [{ id: "decode", label: "Decode", run: (i) => { try { return web.decodeDataUri(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "open-graph-preview", name: "Open Graph Preview", description: "Extract Open Graph meta tags from pasted HTML",
    category: "web", icon: Compass, keywords: ["open graph", "og", "meta", "preview"],
    componentType: "text-io", placeholder: '<meta property="og:title" content="..." />',
    sample: '<title>Demo</title>\n<meta property="og:title" content="Demo Page" />\n<meta property="og:description" content="A demo page" />\n<meta property="og:image" content="https://example.com/img.png" />',
    modes: [{ id: "preview", label: "Extract", run: web.previewOpenGraph }],
  },
  {
    id: "favicon-checker", name: "Favicon Checker", description: "Generate likely favicon URLs for a domain",
    category: "web", icon: Search, keywords: ["favicon", "checker", "domain"],
    componentType: "form",
    fields: [{ type: "text", id: "domain", label: "Domain", defaultValue: "example.com" }],
    run: (v) => { try { return web.faviconCandidates(String(v.domain)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "web-manifest-generator", name: "Web Manifest Generator", description: "Generate a web app manifest.json",
    category: "web", icon: Boxes, keywords: ["manifest", "pwa", "web app"],
    componentType: "form",
    fields: [
      { type: "text", id: "name", label: "App name", defaultValue: "My App" },
      { type: "text", id: "shortName", label: "Short name", defaultValue: "App" },
      { type: "text", id: "themeColor", label: "Theme color", defaultValue: "#111111" },
      { type: "text", id: "backgroundColor", label: "Background color", defaultValue: "#ffffff" },
      { type: "text", id: "startUrl", label: "Start URL", defaultValue: "/" },
      { type: "select", id: "display", label: "Display mode", defaultValue: "standalone", options: [
        { label: "standalone", value: "standalone" }, { label: "fullscreen", value: "fullscreen" },
        { label: "minimal-ui", value: "minimal-ui" }, { label: "browser", value: "browser" },
      ] },
    ],
    run: (v) => web.generateWebManifest({
      name: String(v.name), shortName: String(v.shortName), themeColor: String(v.themeColor),
      backgroundColor: String(v.backgroundColor), startUrl: String(v.startUrl), display: String(v.display),
    }),
  },
  {
    id: "robots-txt-generator", name: "Robots.txt Generator", description: "Generate a robots.txt file",
    category: "web", icon: ScrollText, keywords: ["robots", "txt", "seo", "crawler"],
    componentType: "form",
    fields: [
      { type: "checkbox", id: "allowAll", label: "Allow all crawling", defaultValue: true },
      { type: "textarea", id: "disallowPaths", label: "Disallow paths (one per line)", rows: 4, defaultValue: "/admin\n/private" },
      { type: "text", id: "sitemapUrl", label: "Sitemap URL", defaultValue: "https://example.com/sitemap.xml" },
    ],
    run: (v) => web.generateRobotsTxt({ allowAll: Boolean(v.allowAll), disallowPaths: String(v.disallowPaths), sitemapUrl: String(v.sitemapUrl) }),
  },
  {
    id: "utm-link-builder", name: "UTM Link Builder", description: "Build a shareable URL with UTM campaign tracking parameters",
    category: "web", icon: LinkIcon, keywords: ["utm", "campaign", "link", "tracking", "marketing"], popular: true,
    componentType: "form",
    fields: [
      { type: "text", id: "baseUrl", label: "Destination URL", defaultValue: "https://example.com/landing" },
      { type: "text", id: "source", label: "utm_source", defaultValue: "newsletter" },
      { type: "text", id: "medium", label: "utm_medium", defaultValue: "email" },
      { type: "text", id: "campaign", label: "utm_campaign", defaultValue: "spring_sale" },
      { type: "text", id: "term", label: "utm_term (optional)", defaultValue: "" },
      { type: "text", id: "content", label: "utm_content (optional)", defaultValue: "" },
    ],
    run: (v) => { try { return web.buildUtmLink({ baseUrl: String(v.baseUrl), source: String(v.source), medium: String(v.medium), campaign: String(v.campaign), term: String(v.term || ""), content: String(v.content || "") }); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "browser-info", name: "Browser Information", description: "Show information about your current browser",
    category: "web", icon: Cpu, keywords: ["browser", "information", "navigator", "user agent"],
    componentType: "form", fields: [],
    run: () => { try { return web.browserInfoSnapshot(); } catch (e) { return { error: (e as Error).message }; } },
  },

  // ---------------- Network & IP ----------------
  {
    id: "ipv4-calculator", name: "IPv4 Calculator", description: "Compute network, broadcast and host range from an IPv4 CIDR",
    category: "network", icon: Network, keywords: ["ipv4", "calculator", "cidr", "subnet"], popular: true,
    componentType: "form",
    fields: [{ type: "text", id: "cidr", label: "IP/CIDR", defaultValue: "192.168.1.10/24" }],
    run: (v) => { try { return net.ipv4Calculator(String(v.cidr)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "ipv6-calculator", name: "IPv6 Calculator", description: "Expand or compress an IPv6 address",
    category: "network", icon: Router, keywords: ["ipv6", "calculator", "expand", "compress"],
    componentType: "form",
    fields: [{ type: "text", id: "address", label: "IPv6 address", defaultValue: "2001:db8::8a2e:370:7334" }],
    run: (v) => { try { return net.ipv6Calculator(String(v.address)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "subnet-calculator", name: "Subnet Calculator", description: "Calculate subnet details from an IPv4 CIDR",
    category: "network", icon: Server, keywords: ["subnet", "calculator", "cidr"],
    componentType: "form",
    fields: [{ type: "text", id: "cidr", label: "IP/CIDR", defaultValue: "10.0.0.5/16" }],
    run: (v) => { try { return net.subnetCalculator(String(v.cidr)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "cidr-calculator", name: "CIDR Calculator", description: "Calculate address range details from a CIDR block",
    category: "network", icon: Boxes, keywords: ["cidr", "calculator", "range"],
    componentType: "form",
    fields: [{ type: "text", id: "cidr", label: "IP/CIDR", defaultValue: "172.16.0.1/20" }],
    run: (v) => { try { return net.cidrCalculator(String(v.cidr)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "ip-decimal-converter", name: "IP Decimal Converter", description: "Convert an IPv4 address to/from a decimal integer",
    category: "network", icon: Binary, keywords: ["ip", "decimal", "convert"],
    componentType: "form",
    fields: [{ type: "text", id: "value", label: "IP address or decimal", defaultValue: "192.168.1.1" }],
    run: (v) => { try { return net.ipDecimalConverter(String(v.value)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "ip-binary-converter", name: "IP Binary Converter", description: "Convert an IPv4 address to/from binary",
    category: "network", icon: Binary, keywords: ["ip", "binary", "convert"],
    componentType: "form",
    fields: [{ type: "text", id: "value", label: "IP address or binary", defaultValue: "192.168.1.1" }],
    run: (v) => { try { return net.ipBinaryConverter(String(v.value)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "ipv4-range-calculator", name: "IPv4 Range Calculator", description: "Calculate the address count and CIDR for an IP range",
    category: "network", icon: Route, keywords: ["ipv4", "range", "calculator"],
    componentType: "form",
    fields: [
      { type: "text", id: "start", label: "Start IP", defaultValue: "192.168.1.1" },
      { type: "text", id: "end", label: "End IP", defaultValue: "192.168.1.50" },
    ],
    run: (v) => { try { return net.ipv4RangeCalculator({ start: String(v.start), end: String(v.end) }); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "mac-address-formatter", name: "MAC Address Formatter", description: "Normalize a MAC address into colon, dash and dot forms",
    category: "network", icon: Fingerprint, keywords: ["mac", "address", "format"],
    componentType: "form",
    fields: [{ type: "text", id: "mac", label: "MAC address", defaultValue: "00:1A:2B:3C:4D:5E" }],
    run: (v) => { try { return net.formatMacAddress(String(v.mac)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "mac-address-generator", name: "MAC Address Generator", description: "Generate a random MAC address",
    category: "network", icon: Shuffle, keywords: ["mac", "address", "generator", "random"],
    componentType: "form", fields: [], run: () => net.generateMacAddress(),
  },
  {
    id: "port-lookup", name: "Port Number Lookup", description: "Look up the common service for a port number",
    category: "network", icon: Search, keywords: ["port", "lookup", "service"],
    componentType: "form",
    fields: [{ type: "text", id: "port", label: "Port number", defaultValue: "443" }],
    run: (v) => { try { return net.lookupPort(String(v.port)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "bandwidth-calculator", name: "Bandwidth Calculator", description: "Calculate total data transferred over time at a given speed",
    category: "network", icon: Gauge, keywords: ["bandwidth", "calculator", "speed"],
    componentType: "form",
    fields: [
      { type: "number", id: "amount", label: "Speed", defaultValue: 100 },
      { type: "select", id: "fromUnit", label: "Unit", defaultValue: "Mb", options: [
        { label: "bits/s", value: "bits" }, { label: "Kb/s", value: "Kb" }, { label: "Mb/s", value: "Mb" }, { label: "Gb/s", value: "Gb" },
      ] },
      { type: "number", id: "durationSeconds", label: "Duration (seconds)", defaultValue: 60 },
    ],
    run: (v) => net.bandwidthCalculator({ amount: Number(v.amount) || 0, fromUnit: String(v.fromUnit), durationSeconds: Number(v.durationSeconds) || 0 }),
  },
  {
    id: "download-time-calculator", name: "Download Time Calculator", description: "Estimate download time from file size and connection speed",
    category: "network", icon: Timer, keywords: ["download", "time", "calculator"], popular: true,
    componentType: "form",
    fields: [
      { type: "number", id: "fileSizeMB", label: "File size (MB)", defaultValue: 500 },
      { type: "number", id: "speedMbps", label: "Connection speed (Mbps)", defaultValue: 100 },
    ],
    run: (v) => { try { return net.downloadTimeCalculator({ fileSizeMB: Number(v.fileSizeMB) || 0, speedMbps: Number(v.speedMbps) || 0 }); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "ip-validator", name: "IP Address Validator", description: "Check whether text is a valid IPv4 or IPv6 address",
    category: "network", icon: ShieldCheck, keywords: ["ip", "validator", "validate"],
    componentType: "form",
    fields: [{ type: "text", id: "ip", label: "IP address", defaultValue: "192.168.1.1" }],
    run: (v) => { try { return net.validateIpAddress(String(v.ip)); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "network-byte-calculator", name: "Network Byte Calculator", description: "Convert between byte units (decimal and binary)",
    category: "network", icon: HardDrive, keywords: ["byte", "calculator", "convert", "kb", "mb", "gb"],
    componentType: "form",
    fields: [
      { type: "number", id: "amount", label: "Amount", defaultValue: 1024 },
      { type: "select", id: "fromUnit", label: "Unit", defaultValue: "MB", options: [
        { label: "B", value: "B" }, { label: "KB", value: "KB" }, { label: "MB", value: "MB" }, { label: "GB", value: "GB" }, { label: "TB", value: "TB" },
        { label: "KiB", value: "KiB" }, { label: "MiB", value: "MiB" }, { label: "GiB", value: "GiB" }, { label: "TiB", value: "TiB" },
      ] },
    ],
    run: (v) => net.networkByteCalculator({ amount: Number(v.amount) || 0, fromUnit: String(v.fromUnit) }),
  },
  {
    id: "random-ip-generator", name: "Random IP Address Generator", description: "Generate random IPv4 or IPv6 addresses for testing",
    category: "network", icon: Shuffle, keywords: ["random", "ip", "ipv4", "ipv6", "generator", "test data"],
    componentType: "form",
    fields: [
      { type: "select", id: "version", label: "IP version", defaultValue: "v4", options: [{ label: "IPv4", value: "v4" }, { label: "IPv6", value: "v6" }] },
      { type: "select", id: "type", label: "Address type (IPv4 only)", defaultValue: "public", options: [{ label: "Public-looking", value: "public" }, { label: "Private (RFC1918)", value: "private" }] },
      { type: "number", id: "count", label: "How many", defaultValue: 5, min: 1, max: 50 },
    ],
    run: (v) => net.randomIpGenerator({ version: String(v.version), type: String(v.type), count: Number(v.count) || 5 }),
  },
  {
    id: "dns-record-formatter", name: "DNS Record Formatter", description: "Format a DNS record into zone-file style text",
    category: "network", icon: ScrollText, keywords: ["dns", "record", "format", "zone"],
    componentType: "form",
    fields: [
      { type: "text", id: "name", label: "Name", defaultValue: "example.com" },
      { type: "select", id: "type", label: "Type", defaultValue: "A", options: [
        { label: "A", value: "A" }, { label: "AAAA", value: "AAAA" }, { label: "CNAME", value: "CNAME" }, { label: "MX", value: "MX" }, { label: "TXT", value: "TXT" }, { label: "NS", value: "NS" },
      ] },
      { type: "number", id: "ttl", label: "TTL", defaultValue: 3600 },
      { type: "text", id: "value", label: "Value", defaultValue: "192.0.2.1" },
      { type: "number", id: "priority", label: "Priority (MX only)", defaultValue: 10 },
    ],
    run: (v) => net.formatDnsRecord({ name: String(v.name), type: String(v.type), ttl: Number(v.ttl) || 3600, value: String(v.value), priority: Number(v.priority) || 10 }),
  },

  // ---------------- Generators ----------------
  {
    id: "password-generator", name: "Password Generator", description: "Generate a cryptographically secure random password",
    category: "generators", icon: Lock, keywords: ["password", "generator", "secure", "random"], popular: true,
    componentType: "form",
    fields: [
      { type: "number", id: "length", label: "Length", defaultValue: 20, min: 4, max: 256 },
      { type: "checkbox", id: "uppercase", label: "Uppercase letters", defaultValue: true },
      { type: "checkbox", id: "lowercase", label: "Lowercase letters", defaultValue: true },
      { type: "checkbox", id: "numbers", label: "Numbers", defaultValue: true },
      { type: "checkbox", id: "symbols", label: "Symbols", defaultValue: true },
      { type: "checkbox", id: "excludeSimilar", label: "Exclude similar characters (i l 1 L o 0 O)", defaultValue: false },
    ],
    run: (v) => {
      try {
        return gen.generatePassword({
          length: Number(v.length) || 20, uppercase: Boolean(v.uppercase), lowercase: Boolean(v.lowercase),
          numbers: Boolean(v.numbers), symbols: Boolean(v.symbols), excludeSimilar: Boolean(v.excludeSimilar),
        });
      } catch (e) { return { error: (e as Error).message }; }
    },
  },
  {
    id: "api-key-generator", name: "API Key Generator", description: "Generate a random API key with an optional prefix",
    category: "generators", icon: KeySquare, keywords: ["api", "key", "generator", "secret"],
    componentType: "form",
    fields: [
      { type: "text", id: "prefix", label: "Prefix", defaultValue: "sk" },
      { type: "number", id: "length", label: "Length (bytes)", defaultValue: 32, min: 8, max: 128 },
    ],
    run: (v) => gen.generateApiKey({ prefix: String(v.prefix), length: Number(v.length) || 32 }),
  },
  {
    id: "env-generator", name: ".env Generator", description: "Turn simple key/value lines into a formatted .env file",
    category: "generators", icon: FileCode2, keywords: ["env", "dotenv", "generator", "config"],
    componentType: "text-io", placeholder: "database url=postgres://...", sample: "database url=postgres://localhost/db\napi key=abc123\ndebug=true",
    downloadExt: "env", downloadMime: "text/plain",
    modes: [{ id: "generate", label: "Generate", run: gen.generateEnvFile }],
  },
  {
    id: "gitignore-generator", name: "Gitignore Generator", description: "Generate a .gitignore file from common presets",
    category: "generators", icon: FileTextIcon, keywords: ["gitignore", "git", "generator"],
    componentType: "form",
    fields: [
      { type: "checkbox", id: "node", label: "Node.js", defaultValue: true },
      { type: "checkbox", id: "python", label: "Python", defaultValue: false },
      { type: "checkbox", id: "java", label: "Java", defaultValue: false },
      { type: "checkbox", id: "macos", label: "macOS", defaultValue: true },
      { type: "checkbox", id: "windows", label: "Windows", defaultValue: false },
      { type: "checkbox", id: "vscode", label: "VS Code", defaultValue: true },
      { type: "checkbox", id: "env", label: "Env files", defaultValue: true },
      { type: "checkbox", id: "logs", label: "Log files", defaultValue: false },
    ],
    downloadExt: "gitignore", downloadMime: "text/plain",
    run: (v) => gen.generateGitignore({
      presets: ["node", "python", "java", "macos", "windows", "vscode", "env", "logs"].filter((p) => Boolean(v[p])),
    }),
  },
  {
    id: "dockerfile-generator", name: "Dockerfile Generator", description: "Generate a basic Dockerfile from your app settings",
    category: "generators", icon: Container, keywords: ["dockerfile", "docker", "generator"],
    componentType: "form",
    fields: [
      { type: "text", id: "baseImage", label: "Base image", defaultValue: "node:20-alpine" },
      { type: "text", id: "workdir", label: "Working directory", defaultValue: "/app" },
      { type: "text", id: "copyCommand", label: "Copy command", defaultValue: "COPY . ." },
      { type: "text", id: "installCommand", label: "Install command", defaultValue: "npm install" },
      { type: "text", id: "runCommand", label: "Build command", defaultValue: "npm run build" },
      { type: "text", id: "port", label: "Expose port", defaultValue: "3000" },
      { type: "text", id: "cmd", label: "CMD", defaultValue: '["node", "index.js"]' },
    ],
    downloadExt: "txt", downloadMime: "text/plain",
    run: (v) => gen.generateDockerfile({
      baseImage: String(v.baseImage), workdir: String(v.workdir), copyCommand: String(v.copyCommand),
      installCommand: String(v.installCommand), runCommand: String(v.runCommand), port: String(v.port), cmd: String(v.cmd),
    }),
  },
  {
    id: "docker-compose-generator", name: "Docker Compose Generator", description: "Generate a docker-compose.yml service definition",
    category: "generators", icon: Boxes, keywords: ["docker", "compose", "generator", "yaml"],
    componentType: "form",
    fields: [
      { type: "text", id: "serviceName", label: "Service name", defaultValue: "app" },
      { type: "text", id: "image", label: "Image", defaultValue: "node:20-alpine" },
      { type: "textarea", id: "ports", label: "Ports (one per line)", rows: 3, defaultValue: "3000:3000" },
      { type: "textarea", id: "volumes", label: "Volumes (one per line)", rows: 3, defaultValue: ".:/app" },
      { type: "textarea", id: "env", label: "Environment (one per line)", rows: 3, defaultValue: "NODE_ENV=production" },
    ],
    downloadExt: "yml", downloadMime: "text/yaml",
    run: (v) => gen.generateDockerCompose({
      serviceName: String(v.serviceName), image: String(v.image), ports: String(v.ports), volumes: String(v.volumes), env: String(v.env),
    }),
  },
  {
    id: "nginx-config-generator", name: "Nginx Config Generator", description: "Generate a basic Nginx server block",
    category: "generators", icon: Server, keywords: ["nginx", "config", "generator", "server"],
    componentType: "form",
    fields: [
      { type: "text", id: "serverName", label: "Server name", defaultValue: "example.com" },
      { type: "text", id: "listenPort", label: "Listen port", defaultValue: "80" },
      { type: "text", id: "root", label: "Root directory", defaultValue: "/var/www/html" },
      { type: "text", id: "proxyPass", label: "Proxy pass URL (optional)", defaultValue: "" },
    ],
    downloadExt: "conf", downloadMime: "text/plain",
    run: (v) => gen.generateNginxConfig({ serverName: String(v.serverName), listenPort: String(v.listenPort), root: String(v.root), proxyPass: String(v.proxyPass) }),
  },
  {
    id: "cors-header-generator", name: "CORS Header Generator", description: "Generate CORS response headers",
    category: "generators", icon: ShieldCheck, keywords: ["cors", "header", "generator"],
    componentType: "form",
    fields: [
      { type: "text", id: "origins", label: "Allowed origins", defaultValue: "*" },
      { type: "text", id: "methods", label: "Allowed methods", defaultValue: "GET, POST, PUT, DELETE, OPTIONS" },
      { type: "text", id: "headers", label: "Allowed headers", defaultValue: "Content-Type, Authorization" },
      { type: "checkbox", id: "credentials", label: "Allow credentials", defaultValue: false },
    ],
    run: (v) => gen.generateCorsHeaders({ origins: String(v.origins), methods: String(v.methods), headers: String(v.headers), credentials: Boolean(v.credentials) }),
  },
  {
    id: "csp-header-generator", name: "CSP Header Generator", description: "Generate a Content-Security-Policy header",
    category: "generators", icon: ShieldAlert, keywords: ["csp", "header", "security", "generator"],
    componentType: "form",
    fields: [
      { type: "text", id: "defaultSrc", label: "default-src", defaultValue: "'self'" },
      { type: "text", id: "scriptSrc", label: "script-src", defaultValue: "'self'" },
      { type: "text", id: "styleSrc", label: "style-src", defaultValue: "'self' 'unsafe-inline'" },
      { type: "text", id: "imgSrc", label: "img-src", defaultValue: "'self' data:" },
      { type: "text", id: "connectSrc", label: "connect-src", defaultValue: "'self'" },
    ],
    run: (v) => gen.generateCspHeader({
      defaultSrc: String(v.defaultSrc), scriptSrc: String(v.scriptSrc), styleSrc: String(v.styleSrc), imgSrc: String(v.imgSrc), connectSrc: String(v.connectSrc),
    }),
  },
  {
    id: "og-meta-generator", name: "Open Graph Meta Generator", description: "Generate Open Graph meta tags for a page",
    category: "generators", icon: Compass, keywords: ["open graph", "meta", "generator", "seo"],
    componentType: "form",
    fields: [
      { type: "text", id: "title", label: "Title", defaultValue: "My Page" },
      { type: "text", id: "description", label: "Description", defaultValue: "A great page" },
      { type: "text", id: "image", label: "Image URL", defaultValue: "https://example.com/og.png" },
      { type: "text", id: "url", label: "Page URL", defaultValue: "https://example.com" },
      { type: "text", id: "type", label: "Type", defaultValue: "website" },
    ],
    run: (v) => gen.generateOgMetaTags({ title: String(v.title), description: String(v.description), image: String(v.image), url: String(v.url), type: String(v.type) }),
  },
  {
    id: "sitemap-generator", name: "Sitemap Generator", description: "Generate a sitemap.xml from a list of URLs",
    category: "generators", icon: Route, keywords: ["sitemap", "xml", "generator", "seo"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "urls", label: "URLs (one per line)", rows: 5, defaultValue: "https://example.com/\nhttps://example.com/about" },
      { type: "text", id: "changefreq", label: "Change frequency", defaultValue: "weekly" },
      { type: "text", id: "priority", label: "Priority", defaultValue: "0.8" },
    ],
    downloadExt: "xml", downloadMime: "application/xml",
    run: (v) => gen.generateSitemap({ urls: String(v.urls), changefreq: String(v.changefreq), priority: String(v.priority) }),
  },
  {
    id: "html-boilerplate-generator", name: "HTML Boilerplate Generator", description: "Generate a basic HTML5 boilerplate document",
    category: "generators", icon: Code, keywords: ["html", "boilerplate", "generator", "template"],
    componentType: "form",
    fields: [
      { type: "text", id: "title", label: "Title", defaultValue: "My Page" },
      { type: "text", id: "lang", label: "Language", defaultValue: "en" },
      { type: "checkbox", id: "includeViewport", label: "Include viewport meta tag", defaultValue: true },
      { type: "text", id: "cssHref", label: "CSS href (optional)", defaultValue: "styles.css" },
    ],
    downloadExt: "html", downloadMime: "text/html",
    run: (v) => gen.generateHtmlBoilerplate({ title: String(v.title), lang: String(v.lang), includeViewport: Boolean(v.includeViewport), cssHref: String(v.cssHref) }),
  },
  {
    id: "css-reset-generator", name: "CSS Reset Generator", description: "Generate a modern or minimal CSS reset",
    category: "generators", icon: Palette, keywords: ["css", "reset", "generator", "normalize"],
    componentType: "form",
    fields: [{ type: "select", id: "style", label: "Style", defaultValue: "modern", options: [{ label: "Modern", value: "modern" }, { label: "Minimal", value: "minimal" }] }],
    downloadExt: "css", downloadMime: "text/css",
    run: (v) => gen.generateCssReset(String(v.style)),
  },
  {
    id: "color-palette-generator", name: "Random Color Palette Generator", description: "Generate a random set of harmonious hex colors",
    category: "generators", icon: Palette, keywords: ["color", "palette", "hex", "design", "generator"], popular: true,
    componentType: "form",
    fields: [
      { type: "number", id: "count", label: "Number of colors", defaultValue: 5, min: 2, max: 20 },
      { type: "select", id: "mode", label: "Palette style", defaultValue: "random", options: [
        { label: "Random", value: "random" }, { label: "Monochrome", value: "monochrome" }, { label: "Analogous", value: "analogous" },
      ] },
    ],
    run: (v) => gen.generateColorPalette({ count: Number(v.count) || 5, mode: String(v.mode) }),
  },
  {
    id: "random-data-generator", name: "Random Data Generator", description: "Generate random sample data rows as JSON or CSV",
    category: "generators", icon: Shuffle, keywords: ["random", "data", "generator", "fake", "mock"],
    componentType: "form",
    fields: [
      { type: "number", id: "count", label: "Row count", defaultValue: 10, min: 1, max: 500 },
      { type: "select", id: "format", label: "Format", defaultValue: "json", options: [{ label: "JSON", value: "json" }, { label: "CSV", value: "csv" }] },
      { type: "checkbox", id: "id", label: "Include id", defaultValue: true },
      { type: "checkbox", id: "name", label: "Include name", defaultValue: true },
      { type: "checkbox", id: "email", label: "Include email", defaultValue: true },
      { type: "checkbox", id: "age", label: "Include age", defaultValue: false },
      { type: "checkbox", id: "phone", label: "Include phone", defaultValue: false },
    ],
    run: (v) => gen.generateRandomData({
      count: Number(v.count) || 10, format: String(v.format),
      fields: ["id", "name", "email", "age", "phone"].filter((f) => Boolean(v[f])),
    }),
  },

  // ---------------- Subtitle & Data ----------------
  {
    id: "srt-formatter", name: "SRT Formatter", description: "Validate and re-number an SRT subtitle file",
    category: "subtitle-data", icon: Captions, keywords: ["srt", "subtitle", "format", "editor", "viewer"], popular: true,
    componentType: "text-io",
    placeholder: "1\n00:00:00,000 --> 00:00:02,000\nHello",
    sample: "1\n00:00:00,000 --> 00:00:02,000\nHello there\n\n2\n00:00:02,500 --> 00:00:04,000\nWelcome!",
    downloadExt: "srt", downloadMime: "text/plain",
    modes: [
      { id: "format", label: "Format", run: (i) => { try { return sub.srtFormat(i); } catch (e) { throw new Error((e as Error).message); } } },
      { id: "validate", label: "Validate", run: (i) => { try { return sub.srtValidate(i); } catch (e) { throw new Error((e as Error).message); } } },
    ],
  },
  {
    id: "srt-timestamp-shifter", name: "SRT Timestamp Shifter", description: "Shift every timestamp in an SRT file by a fixed offset",
    category: "subtitle-data", icon: Timer, keywords: ["srt", "timestamp", "shift", "subtitle", "sync"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "srt", label: "SRT content", rows: 8, defaultValue: "1\n00:00:00,000 --> 00:00:02,000\nHello there\n\n2\n00:00:02,500 --> 00:00:04,000\nWelcome!" },
      { type: "number", id: "shiftMs", label: "Shift (milliseconds, negative to shift earlier)", defaultValue: 1000 },
    ],
    downloadExt: "srt", downloadMime: "text/plain",
    run: (v) => { try { return sub.shiftSrtTimestamps(String(v.srt), Number(v.shiftMs) || 0); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "srt-to-txt", name: "SRT \u2192 TXT", description: "Strip timestamps and numbering, keeping only subtitle text",
    category: "subtitle-data", icon: FileTextIcon, keywords: ["srt", "txt", "convert", "subtitle"],
    componentType: "text-io", placeholder: "1\n00:00:00,000 --> 00:00:02,000\nHello",
    sample: "1\n00:00:00,000 --> 00:00:02,000\nHello there\n\n2\n00:00:02,500 --> 00:00:04,000\nWelcome!",
    downloadExt: "txt", downloadMime: "text/plain",
    modes: [{ id: "convert", label: "Convert", run: (i) => { try { return sub.srtToText(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "txt-to-srt", name: "TXT \u2192 SRT", description: "Generate a basic SRT file from plain text lines",
    category: "subtitle-data", icon: Captions, keywords: ["txt", "srt", "convert", "subtitle"],
    componentType: "form",
    fields: [
      { type: "textarea", id: "text", label: "Text (one subtitle line per line)", rows: 8, defaultValue: "Hello there\nWelcome!\nEnjoy the show." },
      { type: "number", id: "secondsPerLine", label: "Seconds per line", defaultValue: 3, min: 1, max: 60 },
    ],
    downloadExt: "srt", downloadMime: "text/plain",
    run: (v) => { try { return sub.textToSrt(String(v.text), Number(v.secondsPerLine) || 3); } catch (e) { return { error: (e as Error).message }; } },
  },
  {
    id: "vtt-formatter", name: "VTT Viewer", description: "Validate and format a WebVTT subtitle file",
    category: "subtitle-data", icon: Subtitles, keywords: ["vtt", "webvtt", "subtitle", "viewer", "format"],
    componentType: "text-io", placeholder: "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello",
    sample: "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello there\n\n00:00:02.500 --> 00:00:04.000\nWelcome!",
    downloadExt: "vtt", downloadMime: "text/vtt",
    modes: [{ id: "format", label: "Format", run: (i) => { try { return sub.vttFormat(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "srt-to-vtt", name: "SRT \u2192 VTT", description: "Convert an SRT subtitle file into WebVTT format",
    category: "subtitle-data", icon: Captions, keywords: ["srt", "vtt", "convert", "subtitle"],
    componentType: "text-io", placeholder: "1\n00:00:00,000 --> 00:00:02,000\nHello",
    sample: "1\n00:00:00,000 --> 00:00:02,000\nHello there\n\n2\n00:00:02,500 --> 00:00:04,000\nWelcome!",
    downloadExt: "vtt", downloadMime: "text/vtt",
    modes: [{ id: "convert", label: "Convert", run: (i) => { try { return sub.srtToVtt(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "vtt-to-srt", name: "VTT \u2192 SRT", description: "Convert a WebVTT subtitle file into SRT format",
    category: "subtitle-data", icon: Subtitles, keywords: ["vtt", "srt", "convert", "subtitle"],
    componentType: "text-io", placeholder: "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello",
    sample: "WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nHello there\n\n00:00:02.500 --> 00:00:04.000\nWelcome!",
    downloadExt: "srt", downloadMime: "text/plain",
    modes: [{ id: "convert", label: "Convert", run: (i) => { try { return sub.vttToSrt(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "csv-viewer", name: "CSV Viewer", description: "Preview CSV data as a formatted Markdown table",
    category: "subtitle-data", icon: Table2, keywords: ["csv", "viewer", "preview", "table"],
    componentType: "text-io", placeholder: "a,b\n1,2", sample: "name,age\nJohn,20\nAnna,25",
    modes: [{ id: "preview", label: "Preview", run: (i) => { try { return sub.csvToMarkdownTable(i); } catch (e) { throw new Error((e as Error).message); } } }],
  },
  {
    id: "file-hash-calculator", name: "File Hash Calculator", description: "Compute the SHA-256 hash of pasted file content",
    category: "subtitle-data", icon: Hash, keywords: ["file", "hash", "sha256", "checksum"],
    componentType: "text-io", placeholder: "Paste file content...", sample: "Hello, world!",
    modes: [{ id: "hash", label: "Calculate SHA-256", run: (input) => enc.sha(input, "SHA-256") }],
  },
  {
    id: "file-info-viewer", name: "File Information Viewer", description: "Show size, word count, line count and encoding hints for pasted text",
    category: "subtitle-data", icon: FileSpreadsheet, keywords: ["file", "information", "viewer", "metadata"],
    componentType: "text-io", placeholder: "Paste file content...", sample: "Hello, world!\nThis is a sample file.",
    modes: [{ id: "info", label: "Analyze", run: sub.textFileInfo }],
  },

  // ---------------- Image ----------------
  {
    id: "image-resizer", name: "Image Resizer", description: "Resize an image to exact pixel dimensions",
    category: "image", icon: Maximize2, keywords: ["image", "resize", "scale", "dimensions"], popular: true,
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "number", id: "width", label: "Width (px)", defaultValue: 800 },
      { type: "number", id: "height", label: "Height (px)", defaultValue: 600 },
      { type: "checkbox", id: "keepAspect", label: "Keep aspect ratio (uses width only)", defaultValue: true },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }, { label: "WebP", value: "webp" }] },
      { type: "number", id: "quality", label: "Quality % (JPEG/WebP)", defaultValue: 92 },
    ],
    run: img.resizeImage,
  },
  {
    id: "image-compressor", name: "Image Compressor", description: "Reduce image file size by adjusting quality",
    category: "image", icon: Minimize2, keywords: ["image", "compress", "quality", "size"], popular: true,
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "select", id: "format", label: "Output format", defaultValue: "jpeg", options: [{ label: "JPEG", value: "jpeg" }, { label: "WebP", value: "webp" }] },
      { type: "number", id: "quality", label: "Quality %", defaultValue: 70, min: 1, max: 100 },
    ],
    run: img.compressImage,
  },
  {
    id: "image-format-converter", name: "Image Format Converter", description: "Convert an image between PNG, JPEG and WebP",
    category: "image", icon: FileImage, keywords: ["image", "convert", "png", "jpeg", "webp", "format"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "select", id: "format", label: "Target format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }, { label: "WebP", value: "webp" }] },
      { type: "number", id: "quality", label: "Quality % (JPEG/WebP)", defaultValue: 92 },
    ],
    run: img.convertImageFormat,
  },
  {
    id: "image-cropper", name: "Image Cropper", description: "Crop an image to a chosen rectangle",
    category: "image", icon: Crop, keywords: ["image", "crop", "cut", "trim"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "number", id: "x", label: "X offset (px)", defaultValue: 0 },
      { type: "number", id: "y", label: "Y offset (px)", defaultValue: 0 },
      { type: "number", id: "width", label: "Crop width (px)", defaultValue: 200 },
      { type: "number", id: "height", label: "Crop height (px)", defaultValue: 200 },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }] },
    ],
    run: img.cropImage,
  },
  {
    id: "image-to-base64", name: "Image to Base64", description: "Convert an image file into a base64 data URI",
    category: "image", icon: Binary, keywords: ["image", "base64", "data uri", "encode"], popular: true,
    componentType: "image",
    fields: [{ type: "file", id: "file", label: "Image file", accept: "image/*" }],
    run: img.imageToBase64,
  },
  {
    id: "base64-to-image", name: "Base64 to Image", description: "Decode a base64 string or data URI back into a viewable image",
    category: "image", icon: ImagePlus, keywords: ["base64", "image", "decode", "data uri"],
    componentType: "image",
    fields: [
      { type: "textarea", id: "base64", label: "Base64 string or data URI", placeholder: "data:image/png;base64,...", rows: 6 },
      { type: "select", id: "mimeType", label: "Assumed type (if not a data URI)", defaultValue: "image/png", options: [{ label: "PNG", value: "image/png" }, { label: "JPEG", value: "image/jpeg" }, { label: "WebP", value: "image/webp" }, { label: "GIF", value: "image/gif" }] },
    ],
    run: img.base64ToImage,
  },
  {
    id: "image-color-picker", name: "Image Color Picker", description: "Read the exact color of a pixel in an image",
    category: "image", icon: Pipette, keywords: ["image", "color", "picker", "pixel", "hex"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "number", id: "x", label: "X coordinate (px)", defaultValue: 0 },
      { type: "number", id: "y", label: "Y coordinate (px)", defaultValue: 0 },
    ],
    run: img.pickPixelColor,
  },
  {
    id: "image-average-color", name: "Image Average Color", description: "Compute the average color across an entire image",
    category: "image", icon: Blend, keywords: ["image", "average", "color", "dominant"],
    componentType: "image",
    fields: [{ type: "file", id: "file", label: "Image file", accept: "image/*" }],
    run: img.averageColor,
  },
  {
    id: "image-metadata-viewer", name: "Image Metadata Viewer", description: "Inspect dimensions, file size and type of an image",
    category: "image", icon: FileSearch, keywords: ["image", "metadata", "exif", "dimensions", "info"],
    componentType: "image",
    fields: [{ type: "file", id: "file", label: "Image file", accept: "image/*" }],
    run: img.imageMetadata,
  },
  {
    id: "image-watermark", name: "Image Watermark", description: "Overlay text watermark onto an image",
    category: "image", icon: Layers, keywords: ["image", "watermark", "text", "overlay", "brand"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "text", id: "text", label: "Watermark text", defaultValue: "\u00a9 Your Brand" },
      { type: "number", id: "fontSize", label: "Font size (px)", defaultValue: 32 },
      { type: "number", id: "opacity", label: "Opacity %", defaultValue: 60, min: 0, max: 100 },
      { type: "color", id: "color", label: "Text color", defaultValue: "#ffffff" },
      { type: "select", id: "position", label: "Position", defaultValue: "bottom-right", options: [{ label: "Top left", value: "top-left" }, { label: "Top right", value: "top-right" }, { label: "Bottom left", value: "bottom-left" }, { label: "Bottom right", value: "bottom-right" }, { label: "Center", value: "center" }] },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }] },
    ],
    run: img.watermarkImage,
  },
  {
    id: "image-rotate-flip", name: "Image Rotate / Flip", description: "Rotate an image by 90\u00b0 steps or flip it horizontally/vertically",
    category: "image", icon: FlipHorizontal, keywords: ["image", "rotate", "flip", "mirror", "orientation"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "select", id: "rotate", label: "Rotate", defaultValue: "0", options: [{ label: "0\u00b0", value: "0" }, { label: "90\u00b0", value: "90" }, { label: "180\u00b0", value: "180" }, { label: "270\u00b0", value: "270" }] },
      { type: "checkbox", id: "flipH", label: "Flip horizontally", defaultValue: false },
      { type: "checkbox", id: "flipV", label: "Flip vertically", defaultValue: false },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }] },
    ],
    run: img.rotateFlipImage,
  },
  {
    id: "image-filters", name: "Image Filters", description: "Apply grayscale, sepia, blur and other filters to an image",
    category: "image", icon: Sparkles, keywords: ["image", "filter", "grayscale", "sepia", "blur", "invert"], popular: true,
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "select", id: "filter", label: "Filter", defaultValue: "grayscale", options: [{ label: "Grayscale", value: "grayscale" }, { label: "Sepia", value: "sepia" }, { label: "Invert", value: "invert" }, { label: "Blur", value: "blur" }, { label: "Brightness", value: "brightness" }, { label: "Contrast", value: "contrast" }, { label: "Saturate", value: "saturate" }] },
      { type: "number", id: "amount", label: "Amount %", defaultValue: 100, min: 0, max: 300 },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }] },
    ],
    run: img.applyImageFilter,
  },
  {
    id: "image-favicon-generator", name: "Favicon Generator", description: "Crop and resize an image into a standard favicon size",
    category: "image", icon: MonitorSmartphone, keywords: ["favicon", "image", "icon", "website"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "select", id: "size", label: "Favicon size", defaultValue: "32", options: ["16", "32", "48", "57", "60", "72", "76", "96", "114", "120", "144", "152", "180", "192", "512"].map((s) => ({ label: `${s}\u00d7${s}`, value: s })) },
    ],
    run: img.generateFavicon,
  },
  {
    id: "image-color-palette-extractor", name: "Color Palette Extractor", description: "Extract the dominant colors used in an image",
    category: "image", icon: Palette, keywords: ["image", "palette", "colors", "dominant", "hex"], popular: true,
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "number", id: "colorCount", label: "Number of colors", defaultValue: 6, min: 1, max: 12 },
    ],
    run: img.extractColorPalette,
  },
  {
    id: "image-pixelator", name: "Image Pixelator", description: "Apply a mosaic / pixelate effect to an image",
    category: "image", icon: Grid3x3, keywords: ["image", "pixelate", "mosaic", "blocky"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "Image file", accept: "image/*" },
      { type: "number", id: "pixelSize", label: "Pixel block size", defaultValue: 10, min: 2, max: 100 },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "JPEG", value: "jpeg" }] },
    ],
    run: img.pixelateImage,
  },
  {
    id: "svg-to-png", name: "SVG to PNG", description: "Rasterize an SVG file or SVG markup into a PNG image",
    category: "image", icon: FileCode2, keywords: ["svg", "png", "convert", "rasterize", "vector"],
    componentType: "image",
    fields: [
      { type: "file", id: "file", label: "SVG file (optional if pasting markup below)", accept: ".svg,image/svg+xml", optional: true },
      { type: "textarea", id: "svgText", label: "Or paste SVG markup", placeholder: "<svg ...>...</svg>", rows: 5 },
      { type: "number", id: "width", label: "Output width (px)", defaultValue: 512 },
      { type: "number", id: "height", label: "Output height (px)", defaultValue: 512 },
    ],
    run: img.svgToPng,
  },

  // ---------------- QR & Barcode ----------------
  {
    id: "qr-code-generator", name: "QR Code Generator", description: "Generate a QR code from any text or URL",
    category: "qr-barcode", icon: QrCode, keywords: ["qr", "code", "generator", "url", "text"], popular: true,
    componentType: "qr",
    fields: [
      { type: "textarea", id: "text", label: "Text or URL", defaultValue: "https://example.com", rows: 3 },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
      { type: "number", id: "margin", label: "Margin", defaultValue: 2, min: 0, max: 10 },
      { type: "select", id: "errorCorrection", label: "Error correction", defaultValue: "M", options: [{ label: "Low (L)", value: "L" }, { label: "Medium (M)", value: "M" }, { label: "Quartile (Q)", value: "Q" }, { label: "High (H)", value: "H" }] },
      { type: "color", id: "darkColor", label: "Dark color", defaultValue: "#000000" },
      { type: "color", id: "lightColor", label: "Light color", defaultValue: "#ffffff" },
      { type: "select", id: "format", label: "Output format", defaultValue: "png", options: [{ label: "PNG", value: "png" }, { label: "SVG", value: "svg" }] },
    ],
    run: qrb.generateQrCode,
  },
  {
    id: "qr-wifi-generator", name: "Wi-Fi QR Code Generator", description: "Generate a QR code that connects a phone to a Wi-Fi network",
    category: "qr-barcode", icon: Wifi, keywords: ["qr", "wifi", "network", "password"], popular: true,
    componentType: "qr",
    fields: [
      { type: "text", id: "ssid", label: "Network name (SSID)" },
      { type: "text", id: "password", label: "Password" },
      { type: "select", id: "encryption", label: "Encryption", defaultValue: "WPA", options: [{ label: "WPA/WPA2", value: "WPA" }, { label: "WEP", value: "WEP" }, { label: "None", value: "nopass" }] },
      { type: "checkbox", id: "hidden", label: "Hidden network", defaultValue: false },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
      { type: "color", id: "darkColor", label: "Dark color", defaultValue: "#000000" },
      { type: "color", id: "lightColor", label: "Light color", defaultValue: "#ffffff" },
    ],
    run: qrb.generateWifiQrCode,
  },
  {
    id: "qr-vcard-generator", name: "vCard QR Code Generator", description: "Generate a scannable QR code contact card",
    category: "qr-barcode", icon: Contact, keywords: ["qr", "vcard", "contact", "business card"],
    componentType: "qr",
    fields: [
      { type: "text", id: "name", label: "Full name" },
      { type: "text", id: "phone", label: "Phone" },
      { type: "text", id: "email", label: "Email" },
      { type: "text", id: "organization", label: "Organization" },
      { type: "text", id: "url", label: "Website" },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
    ],
    run: qrb.generateVCardQrCode,
  },
  {
    id: "qr-email-generator", name: "Email QR Code Generator", description: "Generate a QR code that opens a pre-filled email",
    category: "qr-barcode", icon: Mail, keywords: ["qr", "email", "mailto"],
    componentType: "qr",
    fields: [
      { type: "text", id: "to", label: "Recipient email" },
      { type: "text", id: "subject", label: "Subject" },
      { type: "textarea", id: "body", label: "Body", rows: 3 },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
    ],
    run: qrb.generateEmailQrCode,
  },
  {
    id: "qr-sms-generator", name: "SMS QR Code Generator", description: "Generate a QR code that opens a pre-filled text message",
    category: "qr-barcode", icon: MessageSquare, keywords: ["qr", "sms", "text message"],
    componentType: "qr",
    fields: [
      { type: "text", id: "phone", label: "Phone number" },
      { type: "textarea", id: "message", label: "Message", rows: 3 },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
    ],
    run: qrb.generateSmsQrCode,
  },
  {
    id: "qr-phone-generator", name: "Phone Number QR Code", description: "Generate a QR code that dials a phone number",
    category: "qr-barcode", icon: Phone, keywords: ["qr", "phone", "call", "dial"],
    componentType: "qr",
    fields: [
      { type: "text", id: "phone", label: "Phone number" },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
    ],
    run: qrb.generatePhoneQrCode,
  },
  {
    id: "qr-logo-generator", name: "QR Code with Logo", description: "Generate a QR code with a logo overlaid in the center",
    category: "qr-barcode", icon: Layers, keywords: ["qr", "logo", "brand", "custom"],
    componentType: "qr",
    fields: [
      { type: "textarea", id: "text", label: "Text or URL", defaultValue: "https://example.com", rows: 3 },
      { type: "file", id: "logo", label: "Logo image (optional)", accept: "image/*", optional: true },
      { type: "number", id: "logoSize", label: "Logo size % of QR", defaultValue: 20, min: 10, max: 35 },
      { type: "number", id: "size", label: "Size (px)", defaultValue: 300 },
      { type: "color", id: "darkColor", label: "Dark color", defaultValue: "#000000" },
      { type: "color", id: "lightColor", label: "Light color", defaultValue: "#ffffff" },
    ],
    run: qrb.generateQrCodeWithLogo,
  },
  {
    id: "barcode-generator", name: "Barcode Generator", description: "Generate a linear barcode (CODE128, EAN-13, UPC and more)",
    category: "qr-barcode", icon: Barcode, keywords: ["barcode", "code128", "ean13", "upc", "generator"], popular: true,
    componentType: "barcode",
    fields: [
      { type: "text", id: "text", label: "Value to encode", defaultValue: "123456789012" },
      { type: "select", id: "format", label: "Barcode format", defaultValue: "CODE128", options: [{ label: "CODE128", value: "CODE128" }, { label: "EAN-13", value: "EAN13" }, { label: "UPC", value: "UPC" }, { label: "CODE39", value: "CODE39" }, { label: "ITF-14", value: "ITF14" }, { label: "MSI", value: "MSI" }, { label: "Pharmacode", value: "pharmacode" }] },
      { type: "number", id: "width", label: "Bar width", defaultValue: 2, min: 1, max: 6 },
      { type: "number", id: "height", label: "Bar height (px)", defaultValue: 100 },
      { type: "checkbox", id: "displayValue", label: "Show text below barcode", defaultValue: true },
      { type: "color", id: "lineColor", label: "Bar color", defaultValue: "#000000" },
      { type: "color", id: "background", label: "Background color", defaultValue: "#ffffff" },
      { type: "number", id: "margin", label: "Margin", defaultValue: 10 },
    ],
    run: qrb.generateBarcode,
  },
  {
    id: "qr-batch-generator", name: "QR Code Batch Generator", description: "Generate a grid of QR codes from multiple lines of text",
    category: "qr-barcode", icon: LayoutGrid, keywords: ["qr", "batch", "bulk", "multiple"],
    componentType: "qr",
    fields: [
      { type: "textarea", id: "lines", label: "One value per line (max 12)", defaultValue: "https://example.com\nHello World\n12345", rows: 6 },
    ],
    run: qrb.generateQrBatch,
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return tools.filter((t) => t.category === category);
}

export function getPopularTools(limit = 8): ToolDefinition[] {
  return tools.filter((t) => t.popular).slice(0, limit);
}

export function getRelatedTools(tool: ToolDefinition, limit = 4): ToolDefinition[] {
  return tools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, limit);
}

export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((t) =>
    [t.name, t.description, t.category, ...t.keywords].join(" ").toLowerCase().includes(q),
  );
}
