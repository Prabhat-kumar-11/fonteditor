import React, { useEffect, useState } from "react";
import fontData from "../punt-frontend-assignment.json";

interface FontVariant {
  weight: number;
  italic: boolean;
  name?: string;
}

interface Font {
  family: string;
  variants: FontVariant[];
}

const defaultFonts: Font[] = [
  {
    family: "Roboto",
    variants: [
      { weight: 400, italic: false, name: "md bolt" },
      { weight: 500, italic: false, name: "md bolt" },
      { weight: 700, italic: false, name: "md bolt" },
    ],
  },
];

const transformFontData = (data: { [key: string]: { [key: string]: string } }): Font[] => {
  return Object.entries(data).map(([family, variants]) => {
    const transformedVariants: FontVariant[] = Object.entries(variants).map(([key, value]) => {
      const weight = parseInt(key.replace("italic", "").trim()) || 400;
      const italic = key.includes("italic");
      return { weight, italic, name: value };
    });
    return { family, variants: transformedVariants };
  });
};

const FontEditor: React.FC = () => {
  const [fonts, setFonts] = useState<Font[]>(defaultFonts);
  const [selectedFont, setSelectedFont] = useState<Font | null>(defaultFonts[0]);
  const [selectedVariant, setSelectedVariant] = useState<FontVariant | null>(defaultFonts[0].variants[0]);
  const [isItalic, setIsItalic] = useState(false);
  const [text, setText] = useState(localStorage.getItem("text") || "");

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const transformedData = transformFontData(fontData);
        setFonts(transformedData.length ? transformedData : defaultFonts);
      } catch (error) {
        console.error("Error fetching fonts:", error);
        setFonts(defaultFonts);
      }
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    const savedFont = localStorage.getItem("selectedFont");
    const savedVariant = localStorage.getItem("selectedVariant");
    const savedIsItalic = localStorage.getItem("isItalic");

    if (savedFont && savedVariant && savedIsItalic) {
      setSelectedFont(JSON.parse(savedFont));
      setSelectedVariant(JSON.parse(savedVariant));
      setIsItalic(JSON.parse(savedIsItalic));
    }
  }, []);

  useEffect(() => {
    if (selectedFont && selectedVariant) {
      localStorage.setItem("selectedFont", JSON.stringify(selectedFont));
      localStorage.setItem("selectedVariant", JSON.stringify(selectedVariant));
      localStorage.setItem("isItalic", JSON.stringify(isItalic));
    }
  }, [selectedFont, selectedVariant, isItalic]);

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const font = fonts.find((f) => f.family === event.target.value);
    setSelectedFont(font || null);
    setSelectedVariant(font?.variants[0] || null);
    setIsItalic(font?.variants[0]?.italic || false);
  };

  const handleVariantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const variant = selectedFont?.variants.find((v) => v.weight === parseInt(event.target.value));
    setSelectedVariant(variant || null);
    setIsItalic(variant?.italic || false);
  };

  const handleItalicChange = () => {
    setIsItalic(!isItalic);
    if (selectedFont && selectedVariant) {
      const variant = selectedFont.variants.find((v) => v.weight === selectedVariant.weight && v.italic === !isItalic);
      setSelectedVariant(variant || null);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    localStorage.setItem("text", event.target.value);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Font Editor</h1>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
          <select
            value={selectedFont?.family || ""}
            onChange={handleFontChange}
            className="p-2 border rounded-md w-full md:w-auto bg-gray-700 text-white"
          >
            {fonts.map((font) => (
              <option key={font.family} value={font.family}>
                {font.family}
              </option>
            ))}
          </select>
          <select
            value={selectedVariant?.weight || ""}
            onChange={handleVariantChange}
            className="p-2 border rounded-md w-full md:w-auto bg-gray-700 text-white"
          >
            {selectedFont?.variants.map((variant) => (
              <option key={`${variant.weight}-${variant.italic}`} value={variant.weight}>
                {variant.weight} {variant.italic ? "Italic" : "Regular"}
              </option>
            ))}
          </select>
          <button
            onClick={handleItalicChange}
            className={`p-2 border rounded-md w-full md:w-auto ${isItalic ? "bg-gray-500" : "bg-gray-700"} text-white`}
          >
            Italic
          </button>
        </div>
        <textarea
          value={text}
          onChange={handleTextChange}
          className="w-full p-4 border rounded-md h-40 resize-none bg-gray-700 text-white"
          style={{
            fontFamily: selectedFont?.family,
            fontWeight: selectedVariant?.weight,
            fontStyle: isItalic ? "italic" : "normal",
          }}
        />
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              setText("");
              setSelectedFont(defaultFonts[0]);
              setSelectedVariant(defaultFonts[0].variants[0]);
              setIsItalic(false);
              localStorage.removeItem("text");
              localStorage.removeItem("selectedFont");
              localStorage.removeItem("selectedVariant");
              localStorage.removeItem("isItalic");
            }}
            className="p-2 px-4 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Reset
          </button>
          <button
            onClick={() => {
              localStorage.setItem("text", text);
              localStorage.setItem("selectedFont", JSON.stringify(selectedFont));
              localStorage.setItem("selectedVariant", JSON.stringify(selectedVariant));
              localStorage.setItem("isItalic", JSON.stringify(isItalic));
            }}
            className="p-2 px-4 border rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontEditor;
