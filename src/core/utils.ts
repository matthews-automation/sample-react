import api from "./api";
import { FORMS } from "./constants";
import { locales } from "@/i18n.config";
import OgImage from "@/assets/images/og-image.jpg";

export const getLocale = (locale: string) => locales.includes(locale) ? locale : 'en';

export const areObjectsEqual = (obj1: { [key: string | number]: any }, obj2: { [key: string | number]: any }) => 
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key]);

export const parseMenuItems = (items: any[]) => {
  const innerItems: Array<any> = JSON.parse(JSON.stringify(items));
  return innerItems.map(item => {
    item.children?.forEach((group: any, groupIndex: number) => {
      if (group.type !== 'taxonomy') {
        const button = item.children[groupIndex];
        item.children.splice(groupIndex, 1);
        item.button = button;
      }
    });
    return item;
  });
};

export const parseMenuChunks = (items: any[]) => {
  const innerItems: Array<any> = JSON.parse(JSON.stringify(items));
  return innerItems.reduce((acc, item, index) => {
    if (item.children?.length === 3) acc.push(item);
    else {
      item.children?.forEach((child: any, index: number) => {
        if (!child.children) return;
        child.children = child.children.reduce(
          (sub_acc: any, sub_child: any, sub_index: number) => {
            const perChunk = child.children.length > 6 ? 6 : 3;
            const chunkIndex = Math.floor(sub_index / perChunk);
            if (!sub_acc[chunkIndex]) sub_acc[chunkIndex] = []; // start a new chunk
            sub_acc[chunkIndex].push(sub_child);
            return sub_acc;
          },
          []
        );
      });

      acc.push(item);
    }
    return acc;
  }, []);
}

export const getHighlightedCopy = (headline: string) => {
  const match = headline.match(/{{(.*?)}}/g);
  return match ? match.map((item) => item.replace(/{{|}}/g, '')) : [];
}

export const parseHeadlineHighlight = (headline: string, strat: 'strip' | 'split' | 'append' | 'wrap' = 'wrap') => {
  let out: string | string[];
  switch (strat) {
    case 'append':
      out = headline?.replaceAll(/{{(.*?)}}/g, (_match, p1) => `
        <span class="gradient-text-wrapper">
          <span class="gradient-text">${p1.replace(/\s/g, '&nbsp;')}</span>
          <span class="normal-text">${p1.replace(/\s/g, '&nbsp;')}</span>
        </span>
      `);
      break;
    case 'split':
      out = headline.split(' ').map(word => word.startsWith('{{') && word.endsWith('}}') ? `<span>${word.slice(2, -2).replace(/\s/g, '&nbsp;')}</span>` : `<span>${word}</span>`);
      out = out.map((word, index) => word.replaceAll(/<span>{{(.*?)}}<\/span>/g, (match, p1) => '<span class="gradient-text">' + p1.replace(/\s/g, '&nbsp;') + '</span>'));
      break;
    case 'strip':
      out = headline.replaceAll(/{{(.*?)}}/g, (_match, p1) => p1.replace(/\s/g, '&nbsp;'));
      break;
    default:
      out = headline?.replaceAll(/{{(.*?)}}/g, (_match, p1) => '<span class="gradient-text">' + p1.replace(/\s/g, '&nbsp;') + '</span>');
      break;
  }
  return out;
};

export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => { func.apply(context, args); }, wait);
  };
}

export const replaceRegionAssistLanguages = (props: {replacements: {[key: string]: string}; text: string}) => {
  const { replacements, text } = props;
  let res = text;
  const replacementMap = new Map(Object.entries(replacements));
  replacementMap.forEach((value, key) => {
    // res = res.replaceAll(new RegExp(`{{${key}}}`, 'g'), value);
    res = res.replaceAll(key, value);
  })
  return res;
}

export const parseLink = (link: string) => {
  const frontEndUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8080';
  const tempUrl = "https://matthews-fe.grw.io";
  const mapObj = { [wpUrl]: '', [frontEndUrl]: '', [tempUrl]: '' };
  var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
  return link.replace(re, (matched) => mapObj[matched.toLowerCase()]);
}

export const combineTerms = (terms: Term[]) => {
  const combinedTerms: { [key: number | string]: Term} = {};
  terms.forEach((term) => {
    if (term.slug !== 'technologies' && term.slug !== 'products-services') {
      combinedTerms[term.term_id] = term;
    } else if (!combinedTerms['combined']) {
      combinedTerms['combined'] = { ...term };
    } else {
      combinedTerms['combined'].name += `, ${term.name}`;
      if (term.children) {
        combinedTerms['combined'].children = combinedTerms['combined'].children?.concat(term.children);
        combinedTerms['combined'].displayChildren = combinedTerms['combined'].children?.reduce((acc, child) => {
          const existing = acc.find(item => item.name === child.name);
          if (existing) {
            existing.term_ids?.push(child.term_id);
            existing.slug += `,${child.slug}`;
            } else {
            child.term_ids = [child.term_id];
            acc.push({ ...child });
          }
          return acc;
        }, [] as Term[]);
      }
    }
  });
  const combined = combinedTerms['combined'];
  delete combinedTerms['combined'];
  return [combined, ...Object.values(combinedTerms)].filter(term => term);
}

export const getCardTerms = (terms: Term[]) => {
  const deduped: Term[] = [];
  terms.forEach((term) => { if (!deduped.find((t) => t.name === term.name)) deduped.push(term); });
  deduped.sort((a, b) => a.parent - b.parent);
  return deduped.filter(term => term.parent);
}

export const getFormFields = (name: keyof typeof FORMS, labels: ContactPage['acf']['form_labels']) => {
  const fields = FORMS[name];
  return fields.map((field) => {
    field.label = labels[field.name as keyof typeof labels];
    if (field.placeholder) field.placeholder = labels[field.placeholder as keyof typeof labels] || field.placeholder;
    return field;
  });
}

export const getBlogMetaData = async (params: { locale: string; slug: string; type: "posts" | "case-studies" | "whitepapers" }) => {
  const locale = getLocale(params.locale);
  const data = await api.getInsight<BlogPage>(locale, params.slug, params.type);
  if (!data) return { title: "404 Not Found" };
  const { page_meta } = data.acf;
  const image = page_meta.og_image || OgImage.src;
  return {
    title: page_meta.title || data.title.rendered,
    description: page_meta.description,
    openGraph: {
      description: page_meta.description,
      title: page_meta.title,
      images: [image],
    },
  };
}

export const chunkArrayEvenly = <T>(arr: T[], n: number): T[][] => {
  if (arr.length <= n) return [arr];
  const totalItems = arr.length;
  const totalGroups = Math.ceil(totalItems / n);
  const baseSize = Math.floor(totalItems / totalGroups);
  const remainder = totalItems % totalGroups;
  let result = [];
  let position = 0;
  for (let i = 0; i < totalGroups; i++) {
    const size = i < remainder ? baseSize + 1 : baseSize;
    result.push(arr.slice(position, position + size));
    position += size;
  }
  return result;
};

export const scaleVal = (value: number, invert = 1) => {
  if (typeof window === 'undefined') return value;
  const vw = window.innerWidth / 100;
  return ((value / 1440) * 100 * vw) * invert;
}

export const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  return [hours, minutes, seconds]
    .map((val) => (val < 10 ? `0${val}` : val))
    .filter((val, index) => val !== "00" || index > 0)
    .join(":");
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}