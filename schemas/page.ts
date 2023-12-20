import { KeyedSegment, defineType } from "sanity";
import {arrayToJSONMatchPath, extractWithPath} from '@sanity/mutator'

export default defineType({
	title: 'Page',
	name: 'page',
	type: 'document',
	fields: [
		{
			name: 'title',
			type: 'string',
		},
		{
			name: 'list',
			type: 'array',
			of: [{
				title: 'Item',
				type: 'object',
				fields: [
					{
						name: 'title',
						type: 'string',
						validation: Rule => Rule.required().custom((currentTitle, {document, path}) => {
							if (typeof currentTitle === 'undefined' || !path) return true

							const grandParentPath = arrayToJSONMatchPath(path.slice(0, -2))
							const list = extractWithPath(grandParentPath, document)?.[0]?.value as {_key: string, title?: string}[] | undefined
							const currentKey = (path.at(-2) as KeyedSegment)?._key

							if (!list) return true

							const hasDuplicates = list
								// filter out item that stores the `currentTitle` value
								.filter(item => item._key !== currentKey)
								// at least one item has the same title that the current one
								.some(item => item.title === currentTitle)

							if (!hasDuplicates) return true

							return `Title '${currentTitle}' is duplicated.`
						})
					}
				]
			}]
		},
		{
			name: 'list2',
			type: 'array',
			of: [{
				title: 'Item',
				type: 'object',
				fields: [
					{
						name: 'title',
						type: 'string',
						validation: Rule => Rule.required()
					},
					{
						name: 'text',
						type: 'string',
					},
				]
			}]
		}
	]
})
