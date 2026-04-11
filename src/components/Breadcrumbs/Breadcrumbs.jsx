import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

/**
 * Shared breadcrumb bar.
 *
 * items: Array<{ label: string; path?: string }>
 * The last item is rendered as plain text (current page); earlier items are links.
 */
const Breadcrumbs = ({ items }) => (
  <Breadcrumb
    style={{ marginBottom: 16 }}
    items={items.map((item, i) => ({
      title:
        i < items.length - 1 && item.path ? <Link to={item.path}>{item.label}</Link> : item.label,
    }))}
  />
);

export default Breadcrumbs;
