import { type WP } from '../index'

export default function link (wp: WP): string {
  return `${process.env.BASE_URL}/projects/${wp.project.id}/work_packages/${wp.id}`
}
