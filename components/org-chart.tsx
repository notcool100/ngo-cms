import styles from "./org-chart.module.css";

export interface OrgNode {
	readonly title: string;
	readonly names?: readonly string[];
	readonly children?: readonly OrgNode[];
}

function OrgTreeNode({ node }: { node: OrgNode }) {
	return (
		<li>
			<div className={styles.orgBox}>
				<span className={styles.orgBoxTitle}>{node.title}</span>
				{node.names?.map((name) => (
					<span key={name} className={styles.orgBoxSub}>
						{name}
					</span>
				))}
			</div>
			{node.children && node.children.length > 0 && (
				<ul>
					{node.children.map((child) => (
						<OrgTreeNode key={child.title} node={child} />
					))}
				</ul>
			)}
		</li>
	);
}

export function OrgChart({ root }: { root: OrgNode }) {
	return (
		<div className="overflow-x-auto py-4">
			<ul className={styles.orgTree}>
				<OrgTreeNode node={root} />
			</ul>
		</div>
	);
}
