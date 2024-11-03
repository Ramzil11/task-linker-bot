export function parseText(input: string): { title: string; description: string|null } {
    const [title, ...descriptionParts] = input.split("\n\n");
    if(descriptionParts.length<1){
      return  {
        title: title.trim(),
        description:null
      };
    }
    const description = descriptionParts.join("\n\n").trim();
      return {
        title: title.trim(),
        description
      };
}