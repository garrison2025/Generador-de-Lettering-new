export type BioStyle = 'Coquette' | 'Dark' | 'Minimal' | 'Kawaii';

export function generateBios(name: string, role: string, interests: string, style: BioStyle): string[][] {
  const person = name.trim();
  const job = role.trim();
  const hobbies = interests.split(',').map(item => item.trim()).filter(Boolean).join(' · ');
  if (!person && !job && !hobbies) return [];
  const identity = person || 'Hello';
  const templates: Record<BioStyle, string[][]> = {
    Coquette: [
      [`୨୧ ${identity}`, job && `${job}, with a soft touch`, hobbies && `Little joys: ${hobbies}`, 'Making ordinary days feel lovely ♡'],
      [`♡ Meet ${identity}`, job && `A little corner for a ${job}`, hobbies && `Currently loving ${hobbies}`, 'Stay for the small, beautiful things 🎀'],
      [`${identity} 🎀`, job && `Creating my own story as a ${job}`, hobbies && `${hobbies} make my heart happy`, 'A softer pace, a brighter day ୨୧'],
    ],
    Dark: [
      [`☾ ${identity}`, job && `${job} after hours`, hobbies && `In my orbit: ${hobbies}`, 'Finding light in unexpected places.'],
      [`${identity} · midnight notes`, job && `The quieter side of a ${job}`, hobbies && `Lost in ${hobbies}`, 'Leave a little mystery behind ✦'],
      [`✦ Enter ${identity}’s world`, job && `By day: ${job}`, hobbies && `By night: ${hobbies}`, 'Quiet mind. Unfinished stories. ☾'],
    ],
    Minimal: [
      [identity, job, hobbies, 'Less noise. More meaning.'],
      [`Hello, I’m ${identity}.`, job && `Working as a ${job}.`, hobbies && `Here for ${hobbies}.`, 'A few things that matter.'],
      [identity, job && `${job} | making things happen`, hobbies && `Off the clock: ${hobbies}`, 'One day, one good idea.'],
    ],
    Kawaii: [
      [`ʕ•ᴥ•ʔ ${identity}`, job && `${job} with big dreams`, hobbies && `Happy things: ${hobbies}`, 'Sending a tiny pocket of sunshine 🌸'],
      [`Hi hi! I’m ${identity} ♡`, job && `Your friendly ${job}`, hobbies && `Ask me about ${hobbies}`, 'Collecting smiles, one day at a time ✨'],
      [`${identity}’s cozy corner 🌷`, job && `Leveling up as a ${job}`, hobbies && `Side quests: ${hobbies}`, 'Small steps count too! (˶ᵔ ᵕ ᵔ˶)'],
    ],
  };
  return templates[style].map(lines => lines.filter(Boolean));
}
