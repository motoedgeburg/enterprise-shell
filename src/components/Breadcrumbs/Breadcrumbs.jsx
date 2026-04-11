import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

/**
 * Shared breadcrumb bar.
 *
 * items: Array<{ label: string; path?: string }>
 * The last item is rendered as plain text (current page); earlier items are links.
 *
 * onNavigate?: (path: string) => void
 * When provided, breadcrumb clicks call onNavigate(path) instead of using <Link>.
 * Useful for intercepting navigation (e.g. unsaved-changes confirmation).
 */
const Breadcrumbs = ({ items, onNavigate }) => (
  <Breadcrumb
    style={{ marginBottom: 16 }}
    items={items.map((item, i) => {
      const isLink = i < items.length - 1 && item.path;
      let title;
      if (isLink && onNavigate) {
        title = (
          <a onClick={() => onNavigate(item.path)} role="link" style={{ cursor: 'pointer' }}>
            {item.label}
          </a>
        );
      } else if (isLink) {
        title = <Link to={item.path}>{item.label}</Link>;
      } else {
        title = item.label;
      }
      return { title };
    })}
  />
);

export default Breadcrumbs;
