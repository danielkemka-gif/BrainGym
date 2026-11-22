const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'components', 'brand', 'akuche-book-experience.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetRegex = /const \[isOpen, setIsOpen\] = useState\(false\);[\s\S]*?checkServerProfile\(\);\s*\}, \[forceOpen, user, supabase\]\);/;

const replacement = `const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"cover" | "introduction" | "welcome" | "daily_welcome">("cover");
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    if (user) {
      const rawName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      if (rawName) {
        setFirstName(rawName.split(" ")[0]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setStage("cover");
      return;
    }

    const handleManualOpen = () => {
      setIsOpen(true);
      setStage("cover");
    };
    window.addEventListener("akuche:open-book-experience", handleManualOpen);
    return () => {
      window.removeEventListener("akuche:open-book-experience", handleManualOpen);
    };
  }, [forceOpen]);`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('akuche-book-experience updated cleanly!');
} else {
  console.log('Regex did not match.');
}
